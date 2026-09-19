create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null,
  detail text not null,
  price numeric not null default 0,
  image text not null,
  video_url text,
  category text not null,
  subcategory text,
  stock integer not null default 0,
  age_range text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_users (
  username text primary key,
  password_hash text,
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Safe to re-run after upgrading an existing project from SHA-256 + salt.
alter table public.app_users drop column if exists password_salt;
alter table public.app_users add column if not exists auth_user_id uuid unique references auth.users(id) on delete cascade;
alter table public.app_users alter column password_hash drop not null;

-- Customer profiles are created only after Supabase Auth has verified the identity.
create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_username text;
begin
  profile_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(lower(new.email), ''),
    nullif(new.phone, ''),
    new.id::text
  );

  insert into public.app_users (username, auth_user_id)
  values (profile_username, new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_customer_profile();

-- Administrators are kept separate from customer accounts.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

-- Google administrators are explicitly allow-listed; signing in with an
-- arbitrary Google account never grants access to the admin panel.
create table if not exists public.admin_google_users (
  email text primary key,
  username text not null unique,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

-- Server-only counter used to slow repeated credential guessing.
create table if not exists public.login_attempts (
  username text primary key,
  failed_count integer not null default 0 check (failed_count >= 0),
  last_failed_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  delivery_note text,
  subtotal numeric not null check (subtotal >= 0),
  shipping numeric not null check (shipping >= 0),
  total numeric not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Customer accounts are optional so guest checkout remains available.
alter table public.orders
add column if not exists customer_username text references public.app_users(username);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price numeric not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

create table if not exists public.favorites (
  user_username text not null references public.app_users(username) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  primary key (user_username, product_id)
);

alter table public.products enable row level security;
alter table public.app_users enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_google_users enable row level security;
alter table public.login_attempts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;

-- Favorites are only accessed through authenticated server actions using service_role.
revoke all on table public.favorites from anon, authenticated;
revoke all on table public.admin_google_users from anon, authenticated;

-- One database transaction claims the pending order, checks stock and discounts it.
-- This makes repeated Wompi events harmless even when they arrive concurrently.
create or replace function public.confirm_paid_order(order_reference text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.orders%rowtype;
  line public.order_items%rowtype;
  current_stock integer;
begin
  select * into current_order from public.orders where reference = order_reference for update;
  if not found or current_order.status <> 'pending' then return false; end if;
  for line in select * from public.order_items where order_id = current_order.id loop
    select stock into current_stock from public.products where id = line.product_id for update;
    if current_stock is null or current_stock < line.quantity then
      raise exception 'Insufficient stock for product %', line.product_id;
    end if;
    update public.products set stock = stock - line.quantity, updated_at = now() where id = line.product_id;
  end loop;
  update public.orders set status = 'paid' where id = current_order.id;
  return true;
end;
$$;

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public product reads" on public.products;
create policy "Public product reads"
on public.products for select
to anon
using (true);

-- Removed: anonymous writes let anyone change prices, stock, or delete products.
drop policy if exists "Anon product writes for app admin" on public.products;

-- Removed: customer credentials are only read/written by server actions using service_role.
drop policy if exists "Anon user registration" on public.app_users;
-- Removed: this policy made password hashes and salts publicly readable.
drop policy if exists "Anon user login lookup" on public.app_users;

drop policy if exists "Public product media reads" on storage.objects;
create policy "Public product media reads"
on storage.objects for select
to anon
using (bucket_id = 'product-media');

-- Removed: product media mutations are made only by an authorized server action.
drop policy if exists "Anon product media uploads" on storage.objects;
drop policy if exists "Anon product media updates" on storage.objects;

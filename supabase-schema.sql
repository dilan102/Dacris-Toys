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
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Safe to re-run after upgrading an existing project from SHA-256 + salt.
alter table public.app_users drop column if exists password_salt;

-- Administrators are kept separate from customer accounts.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
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

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price numeric not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

alter table public.products enable row level security;
alter table public.app_users enable row level security;
alter table public.admin_users enable row level security;
alter table public.login_attempts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

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

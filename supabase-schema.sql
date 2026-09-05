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
  password_salt text not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.app_users enable row level security;

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public product reads" on public.products;
create policy "Public product reads"
on public.products for select
to anon
using (true);

drop policy if exists "Anon product writes for app admin" on public.products;
create policy "Anon product writes for app admin"
on public.products for all
to anon
using (true)
with check (true);

drop policy if exists "Anon user registration" on public.app_users;
create policy "Anon user registration"
on public.app_users for insert
to anon
with check (true);

drop policy if exists "Anon user login lookup" on public.app_users;
create policy "Anon user login lookup"
on public.app_users for select
to anon
using (true);

drop policy if exists "Public product media reads" on storage.objects;
create policy "Public product media reads"
on storage.objects for select
to anon
using (bucket_id = 'product-media');

drop policy if exists "Anon product media uploads" on storage.objects;
create policy "Anon product media uploads"
on storage.objects for insert
to anon
with check (bucket_id = 'product-media');

drop policy if exists "Anon product media updates" on storage.objects;
create policy "Anon product media updates"
on storage.objects for update
to anon
using (bucket_id = 'product-media')
with check (bucket_id = 'product-media');

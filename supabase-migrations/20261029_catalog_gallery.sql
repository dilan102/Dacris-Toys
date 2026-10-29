-- Catalogue mode: retain the existing commerce columns, and add a gallery for
-- the public product detail view. This migration is safe to run once or again.
alter table public.products
add column if not exists images text[] not null default '{}';

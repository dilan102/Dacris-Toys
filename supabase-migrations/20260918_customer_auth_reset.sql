-- DESTRUCTIVE, ONE-TIME migration.
-- It removes all legacy password accounts, turns their order history into guest
-- orders, and removes favorites owned by those accounts. Run only after backup.

begin;

alter table public.orders drop constraint if exists orders_customer_username_fkey;
alter table public.orders
add constraint orders_customer_username_fkey
foreign key (customer_username)
references public.app_users(username)
on delete set null;

-- Favorites use ON DELETE CASCADE. Orders are preserved, without a customer link.
delete from public.app_users;

alter table public.app_users alter column password_hash drop not null;
alter table public.app_users add column if not exists auth_user_id uuid unique references auth.users(id) on delete cascade;

commit;

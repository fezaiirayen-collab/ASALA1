-- ASALA â€” rÃ©paration de la connexion entre le site et Supabase.
-- Ã€ exÃ©cuter dans Supabase > SQL Editor avec le rÃ´le propriÃ©taire.
-- Ce script est idempotent et ne supprime aucun produit.

begin;

-- Le site public lit cette vue et ne reÃ§oit jamais la valeur exacte du stock.
grant execute on function public.is_admin() to anon, authenticated;

create or replace view public.catalog_products as
select
  id,
  name,
  category,
  price,
  original_price,
  images,
  color_images,
  description,
  details,
  fabric,
  care,
  sizes,
  colors,
  featured,
  is_new,
  created_at,
  (stock > 0) as in_stock
from public.products;

revoke select on public.products from anon;
grant select on public.products to authenticated;
grant select on public.catalog_products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

alter table public.products enable row level security;
drop policy if exists "Public can read products" on public.products;

drop policy if exists "Admins can read products" on public.products;
create policy "Admins can read products"
on public.products for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can create products" on public.products;
create policy "Admins can create products"
on public.products for insert to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete to authenticated
using (public.is_admin());

-- DonnÃ©es publiques administrables depuis le tableau de bord.
grant select on public.categories, public.site_content to anon, authenticated;
grant select on public.home_sections, public.home_collection_tiles to anon, authenticated;
grant insert, update, delete on public.categories, public.site_content to authenticated;
grant insert, update, delete on public.home_sections, public.home_collection_tiles to authenticated;

alter table public.categories enable row level security;
alter table public.site_content enable row level security;
alter table public.home_sections enable row level security;
alter table public.home_collection_tiles enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read visible site content" on public.site_content;
create policy "Public can read visible site content"
on public.site_content for select to anon, authenticated
using (is_visible = true or public.is_admin());

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
on public.site_content for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active home sections" on public.home_sections;
create policy "Public can read active home sections"
on public.home_sections for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage home sections" on public.home_sections;
create policy "Admins manage home sections"
on public.home_sections for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active collection tiles" on public.home_collection_tiles;
create policy "Public can read active collection tiles"
on public.home_collection_tiles for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage collection tiles" on public.home_collection_tiles;
create policy "Admins manage collection tiles"
on public.home_collection_tiles for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- IdentitÃ© des commandes et lecture limitÃ©e au client connectÃ©.
alter table public.customers
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists phone_secondary text,
  add column if not exists gender text,
  add column if not exists birth_date date;

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create unique index if not exists customers_user_id_unique
  on public.customers(user_id) where user_id is not null;
create index if not exists orders_user_id_idx on public.orders(user_id);

update public.orders o
set user_id = c.user_id
from public.customers c
where o.customer_id = c.id
  and o.user_id is null
  and c.user_id is not null;

grant select on public.customers, public.orders, public.order_items to authenticated;

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Customers can read own profile" on public.customers;
create policy "Customers can read own profile"
on public.customers for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders"
on public.orders for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Customers can read own order items" on public.order_items;
create policy "Customers can read own order items"
on public.order_items for select to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

commit;

-- Force PostgREST Ã  recharger les vues, fonctions et permissions immÃ©diatement.
notify pgrst, 'reload schema';


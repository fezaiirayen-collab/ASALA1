-- Correction des droits du catalogue produits.
-- À exécuter dans Supabase Dashboard > SQL Editor avec un rôle propriétaire.

create or replace view public.catalog_products as
select
  id, name, category, price, original_price, images, color_images, description,
  details, fabric, care, sizes, colors, featured, is_new, created_at,
  (stock > 0) as in_stock
from public.products;

revoke select on table public.products from anon;
grant select on table public.products to authenticated;
grant select on public.catalog_products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;

drop policy if exists "Admins can read products" on public.products;
create policy "Admins can read products"
on public.products for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can create products" on public.products;
create policy "Admins can create products"
on public.products for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (public.is_admin());

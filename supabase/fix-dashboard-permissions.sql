-- Permissions et policies du tableau de bord ASALA.
-- À exécuter dans Supabase Dashboard > SQL Editor avec un rôle propriétaire.
-- La fonction public.is_admin() doit déjà exister (admin-account.sql).

grant select on public.categories, public.site_content to anon, authenticated;
grant insert, update, delete on public.categories, public.site_content to authenticated;
grant select on public.home_sections to anon, authenticated;
grant insert, update, delete on public.home_sections to authenticated;
grant select on public.home_collection_tiles to anon, authenticated;
grant insert, update, delete on public.home_collection_tiles to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;

alter table public.categories enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_content enable row level security;
alter table public.home_sections enable row level security;
alter table public.home_collection_tiles enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read customers" on public.customers;
create policy "Admins read customers"
on public.customers for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers"
on public.customers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders"
on public.orders for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read order items" on public.order_items;
create policy "Admins read order items"
on public.order_items for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can read visible site content" on public.site_content;
create policy "Public can read visible site content"
on public.site_content for select
to anon, authenticated
using (is_visible = true or public.is_admin());

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active home sections" on public.home_sections;
create policy "Public can read active home sections"
on public.home_sections for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage home sections" on public.home_sections;
create policy "Admins manage home sections"
on public.home_sections for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active collection tiles" on public.home_collection_tiles;
create policy "Public can read active collection tiles"
on public.home_collection_tiles for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage collection tiles" on public.home_collection_tiles;
create policy "Admins manage collection tiles"
on public.home_collection_tiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

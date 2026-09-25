-- ASALA — activation d'un compte administrateur
--
-- 1) Créez d'abord l'utilisateur dans Supabase :
--    Authentication > Users > Add user
-- 2) Récupérez l'UUID de ce compte dans Authentication > Users.
-- 3) Ajoutez uniquement cet UUID vérifié avec la requête indiquée plus bas.
-- 4) Exécutez ce fichier dans SQL Editor, puis la requête d'activation.
--
-- Le mot de passe ne doit pas être écrit dans un fichier SQL.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Active un compte Supabase choisi explicitement comme administrateur.
-- Aucun compte n'est promu automatiquement par email.
-- Ajoutez explicitement l'UUID vérifié du compte administrateur dans admin_users.
-- Exemple à exécuter séparément après avoir vérifié l'UUID :
-- insert into public.admin_users (user_id) values ('UUID_ADMIN_VERIFIE') on conflict do nothing;

-- Les produits sont désormais accessibles uniquement aux administrateurs.
drop policy if exists "Public can read products" on public.products;
revoke select on public.products from anon;
grant select on public.products to authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.catalog_products to anon, authenticated;

drop policy if exists "Authenticated users can read products" on public.products;
drop policy if exists "Authenticated users can create products" on public.products;
drop policy if exists "Authenticated users can update products" on public.products;
drop policy if exists "Authenticated users can delete products" on public.products;
drop policy if exists "Admins can read products" on public.products;
drop policy if exists "Admins can create products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

create policy "Admins can read products"
on public.products for select to authenticated
using (public.is_admin());

create policy "Admins can create products"
on public.products for insert to authenticated
with check (public.is_admin());

create policy "Admins can update products"
on public.products for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete products"
on public.products for delete to authenticated
using (public.is_admin());

-- Vérification : cette requête doit retourner uniquement les UUID explicitement promus.
select u.id, u.email, a.created_at
from auth.users u
join public.admin_users a on a.user_id = u.id
;

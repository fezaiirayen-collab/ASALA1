-- ASALA product management schema
-- Run this script in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Caftan',
  price numeric(10, 2) not null default 0 check (price >= 0),
  original_price numeric(10, 2) check (original_price is null or original_price >= price),
  sale_percentage numeric(5, 2) not null default 0 check (sale_percentage >= 0 and sale_percentage <= 100),
  sale_regular_price numeric(10, 2),
  sale_original_price numeric(10, 2),
  sale_original_category text,
  images text[] not null default '{}',
  color_images jsonb not null default '{}'::jsonb,
  description text not null default '',
  details text[] not null default '{}',
  fabric text,
  care text,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists color_images jsonb not null default '{}'::jsonb;

create or replace view public.catalog_products as
select
  id, name, category, price, original_price, images, color_images, description,
  details, fabric, care, sizes, colors, featured, is_new, created_at,
  (stock > 0) as in_stock
from public.products;

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

alter table public.products enable row level security;

-- Le catalogue est consultable par la boutique publique.
revoke select on public.products from anon;
grant select on public.products to authenticated;
grant select on public.catalog_products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Public can read products" on public.products;

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

drop policy if exists "Authenticated users can read products" on public.products;
create policy "Authenticated users can read products"
on public.products for select to authenticated
using (public.is_admin());

drop policy if exists "Authenticated users can create products" on public.products;
create policy "Authenticated users can create products"
on public.products for insert to authenticated
with check (public.is_admin());

drop policy if exists "Authenticated users can update products" on public.products;
create policy "Authenticated users can update products"
on public.products for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can delete products" on public.products;
create policy "Authenticated users can delete products"
on public.products for delete to authenticated
using (public.is_admin());

-- Optional: import the current local catalogue after creating the table.
-- The admin screen itself is ready for manual product creation and editing.

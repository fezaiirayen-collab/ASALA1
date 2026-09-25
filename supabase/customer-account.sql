-- Authentification et profil client ASALA.
-- À exécuter dans Supabase SQL Editor avec un rôle propriétaire.

alter table public.customers
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists phone_secondary text,
  add column if not exists gender text,
  add column if not exists birth_date date;

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_id_idx on public.orders(user_id);
update public.orders o
set user_id = c.user_id
from public.customers c
where o.customer_id = c.id and o.user_id is null and c.user_id is not null;

create unique index if not exists customers_user_id_unique
  on public.customers(user_id)
  where user_id is not null;

grant select, insert, update on public.customers to authenticated;
grant select on public.orders, public.order_items to authenticated;

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Customers can read own profile" on public.customers;
create policy "Customers can read own profile"
on public.customers for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

-- Les clients ne peuvent pas modifier directement leur ligne (notamment
-- order_count et total_spent). Ils passent uniquement par save_customer_profile().
drop policy if exists "Customers can create own profile" on public.customers;
drop policy if exists "Customers can update own profile" on public.customers;

drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders"
on public.orders for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "Customers can read own order items" on public.order_items;
create policy "Customers can read own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
  or public.is_admin()
);

-- Crée automatiquement la fiche client lors de chaque inscription Supabase Auth.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is not null then
    insert into public.customers (user_id, email, first_name, last_name, phone, phone_secondary, gender, birth_date, address)
    values (
      new.id,
      lower(new.email),
      coalesce(new.raw_user_meta_data ->> 'first_name', ''),
      coalesce(new.raw_user_meta_data ->> 'last_name', ''),
      coalesce(new.raw_user_meta_data ->> 'phone', ''),
      nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone_secondary', '')), ''),
      nullif(trim(coalesce(new.raw_user_meta_data ->> 'gender', '')), ''),
      case
        when new.raw_user_meta_data ->> 'birth_date' ~ '^\d{4}-\d{2}-\d{2}$'
        then to_date(new.raw_user_meta_data ->> 'birth_date', 'YYYY-MM-DD')
        else null
      end,
      '{}'::jsonb
    )
    on conflict (email) do update set
      user_id = excluded.user_id,
      first_name = coalesce(nullif(public.customers.first_name, ''), excluded.first_name),
      last_name = coalesce(nullif(public.customers.last_name, ''), excluded.last_name),
      phone = coalesce(nullif(public.customers.phone, ''), excluded.phone),
      phone_secondary = coalesce(nullif(public.customers.phone_secondary, ''), excluded.phone_secondary),
      gender = coalesce(nullif(public.customers.gender, ''), excluded.gender),
      birth_date = coalesce(public.customers.birth_date, excluded.birth_date);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Rattrape les comptes déjà créés avant l'installation du trigger.
insert into public.customers (user_id, email, first_name, last_name, phone, phone_secondary, gender, birth_date, address)
select
  u.id,
  lower(u.email),
  coalesce(u.raw_user_meta_data ->> 'first_name', ''),
  coalesce(u.raw_user_meta_data ->> 'last_name', ''),
  coalesce(u.raw_user_meta_data ->> 'phone', ''),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'phone_secondary', '')), ''),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'gender', '')), ''),
  case
    when u.raw_user_meta_data ->> 'birth_date' ~ '^\d{4}-\d{2}-\d{2}$'
    then to_date(u.raw_user_meta_data ->> 'birth_date', 'YYYY-MM-DD')
    else null
  end,
  '{}'::jsonb
from auth.users u
where u.email is not null
on conflict (email) do update set
  user_id = excluded.user_id,
  first_name = coalesce(nullif(public.customers.first_name, ''), excluded.first_name),
  last_name = coalesce(nullif(public.customers.last_name, ''), excluded.last_name),
  phone = coalesce(nullif(public.customers.phone, ''), excluded.phone),
  phone_secondary = coalesce(nullif(public.customers.phone_secondary, ''), excluded.phone_secondary),
  gender = coalesce(nullif(public.customers.gender, ''), excluded.gender),
  birth_date = coalesce(public.customers.birth_date, excluded.birth_date);

-- Sauvegarde sécurisée du profil et de l'adresse de l'utilisateur connecté.
drop function if exists public.save_customer_profile(text, text, text, text, text, date, jsonb);
create or replace function public.save_customer_profile(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_phone_secondary text,
  p_gender text,
  p_birth_date date,
  p_address jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
begin
  if current_user_id is null then
    raise exception 'Utilisateur non authentifié';
  end if;

  select lower(email)
  into current_email
  from auth.users
  where id = current_user_id;

  if current_email is null then
    raise exception 'Email utilisateur introuvable';
  end if;
  if length(trim(coalesce(p_first_name, ''))) not between 1 and 80
    or length(trim(coalesce(p_last_name, ''))) not between 1 and 80 then
    raise exception 'Nom invalide';
  end if;
  if nullif(trim(coalesce(p_phone, '')), '') is not null
    and (length(trim(p_phone)) > 40 or trim(p_phone) !~ '^[0-9+ ()-]+$') then
    raise exception 'Téléphone invalide';
  end if;
  if nullif(trim(coalesce(p_phone_secondary, '')), '') is not null
    and (length(trim(p_phone_secondary)) > 40 or trim(p_phone_secondary) !~ '^[0-9+ ()-]+$') then
    raise exception 'Téléphone secondaire invalide';
  end if;
  if length(trim(coalesce(p_gender, ''))) > 30 then
    raise exception 'Genre invalide';
  end if;
  if p_birth_date is not null and p_birth_date > current_date then
    raise exception 'Date de naissance invalide';
  end if;
  if jsonb_typeof(coalesce(p_address, '{}'::jsonb)) <> 'object'
    or octet_length(coalesce(p_address, '{}'::jsonb)::text) > 10000 then
    raise exception 'Adresse invalide';
  end if;
  if length(trim(coalesce(p_address->>'street', ''))) > 250
    or length(trim(coalesce(p_address->>'apartment', ''))) > 100
    or length(trim(coalesce(p_address->>'city', ''))) > 100
    or length(trim(coalesce(p_address->>'governorate', ''))) > 100
    or length(trim(coalesce(p_address->>'postalCode', ''))) > 20 then
    raise exception 'Adresse invalide';
  end if;

  insert into public.customers (user_id, email, first_name, last_name, phone, phone_secondary, gender, birth_date, address)
  values (
    current_user_id,
    current_email,
    coalesce(p_first_name, ''),
    coalesce(p_last_name, ''),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_phone_secondary, '')), ''),
    nullif(trim(coalesce(p_gender, '')), ''),
    p_birth_date,
    coalesce(p_address, '{}'::jsonb)
  )
  on conflict (email) do update set
    user_id = current_user_id,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone = excluded.phone,
    phone_secondary = excluded.phone_secondary,
    gender = excluded.gender,
    birth_date = excluded.birth_date,
    address = excluded.address;
end;
$$;

revoke all on function public.save_customer_profile(text, text, text, text, text, date, jsonb) from public;
grant execute on function public.save_customer_profile(text, text, text, text, text, date, jsonb) to authenticated;

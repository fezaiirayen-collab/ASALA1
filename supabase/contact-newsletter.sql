-- Messages du formulaire de contact et abonnés à la newsletter ASALA.
-- À exécuter dans Supabase SQL Editor après admin-dashboard.sql.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  email text primary key,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

create or replace function public.limit_contact_message_rate()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.enforce_public_rate_limit('contact', lower(trim(new.email)), 5, 3600);
  return new;
end;
$$;

drop trigger if exists contact_messages_rate_limit on public.contact_messages;
create trigger contact_messages_rate_limit
before insert on public.contact_messages
for each row execute function public.limit_contact_message_rate();

create or replace function public.limit_newsletter_rate()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.enforce_public_rate_limit('newsletter', lower(trim(new.email)), 3, 86400);
  return new;
end;
$$;

drop trigger if exists newsletter_rate_limit on public.newsletter_subscribers;
create trigger newsletter_rate_limit
before insert on public.newsletter_subscribers
for each row execute function public.limit_newsletter_rate();

grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, update, delete on public.newsletter_subscribers to authenticated;

drop policy if exists "Public can send contact messages" on public.contact_messages;
create policy "Public can send contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 120
  and trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and length(trim(email)) between 5 and 255
  and length(coalesce(trim(phone), '')) <= 40
  and length(trim(subject)) <= 200
  and length(trim(message)) between 2 and 5000
);

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
on public.contact_messages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter"
on public.newsletter_subscribers for insert
to anon, authenticated
with check (
  trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and length(trim(email)) between 5 and 255
);

drop policy if exists "Admins manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins manage newsletter subscribers"
on public.newsletter_subscribers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Paw Paradise app: app usage numbers for the Admin area (Admin → App usage).
-- Run this in Supabase: SQL Editor → New query → paste → Run.
-- Safe to run again; it updates anything from an earlier version.

-- One row per installed copy of the app. The id is a random code made on the
-- phone; nothing personal is stored.
create table if not exists public.app_installs (
  id         uuid primary key,
  platform   text,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  opens      integer not null default 1
);
alter table public.app_installs enable row level security;

-- One row each time the app is opened (kept for 30 days, for the 7- and 30-day totals)
create table if not exists public.app_opens (
  id         bigserial primary key,
  install_id uuid not null references public.app_installs(id) on delete cascade,
  opened_at  timestamptz not null default now()
);
create index if not exists app_opens_opened_at on public.app_opens (opened_at);
alter table public.app_opens enable row level security;
-- (No policies on either table: nobody can read or change them directly. The functions below are the only way in.)

-- Called by the app each time it's opened from the home screen
create or replace function public.app_ping(install_id uuid, device text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_installs (id, platform)
  values (install_id, left(coalesce(device, 'other'), 20))
  on conflict (id) do update
    set last_seen = now(), opens = public.app_installs.opens + 1;
  insert into public.app_opens (install_id) values (install_id);
end;
$$;
grant execute on function public.app_ping(uuid, text) to anon, authenticated;

-- Called when someone turns off counting (switch at the bottom of the Privacy Policy)
create or replace function public.app_forget(install_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.app_installs where id = install_id;
$$;
grant execute on function public.app_forget(uuid) to anon, authenticated;

-- The numbers on Admin → App usage (admins only)
create or replace function public.app_install_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin) then
    raise exception 'Admins only';
  end if;
  -- Keep the opens log small: only the last 30 days are needed
  delete from public.app_opens where opened_at < now() - interval '31 days';
  return json_build_object(
    'total',      (select count(*) from public.app_installs),
    'iphone',     (select count(*) from public.app_installs where platform = 'iphone'),
    'android',    (select count(*) from public.app_installs where platform = 'android'),
    'active',     (select count(*) from public.app_installs where last_seen > now() - interval '3 months'),
    'opens7',     (select count(*) from public.app_opens where opened_at > now() - interval '7 days'),
    'opens30',    (select count(*) from public.app_opens where opened_at > now() - interval '30 days'),
    'opensTotal', (select coalesce(sum(opens), 0) from public.app_installs)
  );
end;
$$;
revoke execute on function public.app_install_stats() from anon;
grant execute on function public.app_install_stats() to authenticated;

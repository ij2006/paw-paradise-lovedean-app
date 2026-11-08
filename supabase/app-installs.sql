-- Paw Paradise app: count how many copies of the app are installed and in use.
-- Run this once in Supabase: SQL Editor → New query → paste → Run.

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
-- (No policies: nobody can read or change the table directly. The two functions below are the only way in.)

-- Called by the app when it's opened from the home screen
create or replace function public.app_ping(install_id uuid, device text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.app_installs (id, platform)
  values (install_id, left(coalesce(device, 'other'), 20))
  on conflict (id) do update
    set last_seen = now(), opens = public.app_installs.opens + 1;
$$;
grant execute on function public.app_ping(uuid, text) to anon, authenticated;

-- Called by someone who opted out: removes their copy from the count
create or replace function public.app_forget(install_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.app_installs where id = install_id;
$$;
grant execute on function public.app_forget(uuid) to anon, authenticated;

-- The numbers shown in the app's Admin area (admins only)
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
  return json_build_object(
    'total',   (select count(*) from public.app_installs),
    'last30',  (select count(*) from public.app_installs where last_seen > now() - interval '30 days'),
    'last7',   (select count(*) from public.app_installs where last_seen > now() - interval '7 days'),
    'iphone',  (select count(*) from public.app_installs where platform = 'iphone'),
    'android', (select count(*) from public.app_installs where platform = 'android')
  );
end;
$$;
revoke execute on function public.app_install_stats() from anon;
grant execute on function public.app_install_stats() to authenticated;

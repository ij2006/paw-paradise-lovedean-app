-- Paw Paradise app: phone notifications for admins
-- Run this once in Supabase: SQL Editor → New query → paste → Run.

-- Phones that have turned on notifications in the app's Admin area
create table if not exists public.push_subscriptions (
  endpoint   text primary key,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

-- Only signed-in admins can add, see or remove phones.
-- (Supabase itself sends the notifications using its own service key, which ignores these rules.)
drop policy if exists "Admins manage push subscriptions" on public.push_subscriptions;
create policy "Admins manage push subscriptions"
  on public.push_subscriptions
  for all
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

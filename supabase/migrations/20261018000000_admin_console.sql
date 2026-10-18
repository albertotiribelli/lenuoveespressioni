-- Admin console (issue #14), increment 1: edit people and dates.
-- Apply manually (Supabase SQL editor or CLI). Replace the placeholder emails first.

create table if not exists public.admins (
  email text primary key
);

alter table public.admins enable row level security;
-- No policies on purpose: the table is only read through is_admin() below.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Public SELECT policies already exist and are left untouched.
create policy "admins can update people"
  on public.people for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can update dates"
  on public.dates for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.admins (email) values
  ('alby.tiri@gmail.com')
on conflict do nothing;

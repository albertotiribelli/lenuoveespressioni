-- Admin console (issue #14), increment 2: edit plays, productions and performance_people.
-- Apply manually (Supabase SQL editor or CLI), after 20261018000000_admin_console.sql (needs public.is_admin()).
-- Public SELECT policies already exist and are left untouched.

create policy "admins can update plays"
  on public.plays for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can update productions"
  on public.productions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can update performance_people"
  on public.performance_people for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

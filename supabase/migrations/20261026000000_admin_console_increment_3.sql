-- Admin console (issue #14), increment 3: create and delete rows.
-- Apply manually (Supabase SQL editor or CLI), after the increment 1 and 2 migrations (needs public.is_admin()).
-- Public SELECT policies already exist and are left untouched.
-- The app blocks deleting rows that other rows depend on, so deletes never rely on cascade rules.

do $$
declare
  t text;
begin
  foreach t in array array['people', 'dates', 'plays', 'productions', 'performance_people']
  loop
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin())',
      'admins can insert ' || t, t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin())',
      'admins can delete ' || t, t
    );
  end loop;
end $$;

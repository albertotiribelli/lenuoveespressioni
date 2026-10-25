-- News section (issue #12): posts and recaps shown on /news, optionally linked to a play.
-- Apply manually (Supabase SQL editor or CLI), after the admin console migrations (needs public.is_admin()).
-- The site works before this is applied: /news simply shows "no news".

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  -- Plain text. Blank lines separate paragraphs.
  body text not null,
  -- A post in the future stays hidden until that moment (scheduling).
  published_at timestamptz not null default now(),
  play_id uuid references public.plays (id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists news_published_at_idx on public.news (published_at desc);
create index if not exists news_play_id_idx on public.news (play_id);

alter table public.news enable row level security;

create policy "public can read published news"
  on public.news for select
  to anon, authenticated
  using (published_at <= now());

-- Admins also see scheduled posts, and can write (for a future admin screen).
create policy "admins can read all news"
  on public.news for select
  to authenticated
  using (public.is_admin());

create policy "admins can insert news"
  on public.news for insert
  to authenticated
  with check (public.is_admin());

create policy "admins can update news"
  on public.news for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete news"
  on public.news for delete
  to authenticated
  using (public.is_admin());

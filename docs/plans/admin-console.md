# Admin console: implementation plan

Issue: #14 "[Features] - Admin console" (opened 2026-10-17).

## Status (2026-10-18)

| Increment | State |
|---|---|
| 1. Edit `people` and `dates` | Code done, PR #15 open (`feat/admin-console-14`). Migration applied in Supabase. Waiting on the Supabase redirect URL and the manual checks in 1.7. |
| 2. Remaining tables | Not started |
| 3. Create and delete | Not started |

Open items before PR #15 can merge:
- Add `<site url>/auth/callback` (production) and `http://localhost:3000/auth/callback` to Supabase Auth redirect URLs. The dashboard failed with "Failed to fetch (api.supabase.com)", so retry from another browser or network. Without it, the magic link lands on the Site URL and login fails.
- Set `ADMIN_EMAILS` in Vercel.
- Run the manual checks in 1.7.
- Check whether the public read policy on `people` exposes `personal_data`.

> As an admin user I want to be able to update infos on actors and shows, so that I don't have to deal in modifying directly the db. And I want to do that also on mobile.

## Decisions (agreed in the planning discussion)

| Topic | Decision |
|---|---|
| Admins | Two people (the maintainer plus one more). No roles, no audit log. |
| Login | Supabase Auth magic link. Fallback: email and password if email rate limits get in the way. |
| Authorization | RLS policies and the user-session client. The service-role key is never used in the app. |
| Admin identity | `admins` table, so adding an admin is a row insert. `ADMIN_EMAILS` env var is a second check in server actions. |
| Scope | Edit existing rows only at first. Add and delete come later. |
| Images | No upload for now. `photo_url` / `poster_url` stay text fields pointing at Supabase Storage URLs. |
| Cache | On-demand `revalidateTag` / `revalidatePath` in the server actions, so no redeploy is needed. |
| Mobile | Responsive layout only (no PWA or offline). |
| Location | `/admin` in the same app, `noindex`, not in the sitemap, gated by middleware. |
| Tests | Auth guard, server actions and forms. |
| Delivery | Feature branch, one PR per increment, each referencing #14 (only the last one closes it). |

## Schema notes (from `lib/database.types.ts`)

- `people`: `bio`, `is_active`, `joined_at`, `name`, `personal_data` (Json), `photo_url`, `role`, `slug`.
- `dates`: `city`, `date`, `gphotos_url`, `notes`, `theater_name`, `tickets_url`, `time`, plus `production_id` (FK).
- Locked in the UI: `id`, `created_at`, `slug`, and foreign keys (`production_id`). `slug` is used in public URLs and `generateStaticParams`.
- **`people.personal_data` is not shown or editable in the admin forms** in increment 1. Before shipping, check whether the public anon policy exposes it. If it does, that is a separate privacy fix, because anyone with the public anon key could read it.

## Revalidation design

Public pages use time-based refresh (`revalidate` between 300 and 86400 seconds, and `unstable_cache` on `/attori`). Admin saves invalidate them directly:

- Add tags to the `unstable_cache` calls in `app/attori/page.tsx` (`people`, `people-timeline`), and to any cached date queries (`dates`).
- After a `people` update: `revalidateTag('people')`, `revalidatePath('/attori')`, `revalidatePath('/attori/[slug]', 'page')`, and the home page.
- After a `dates` update: `revalidateTag('dates')`, `revalidatePath('/')`, `/spettacoli`, `/spettacoli/[slug]` and `/archivio`.
- Edits made directly in the Supabase dashboard still wait for the time-based refresh. That is acceptable.

---

## Increment 1: edit `people` and `dates` (PR 1)

### 1.0 Setup
- [x] Create branch `feat/admin-console-14`.
- [x] Add dependency `@supabase/ssr`.
- [x] Add env vars to `.env.local.example`: `ADMIN_EMAILS` (comma-separated). Document them in the README.

### 1.1 Database (SQL migration file in `supabase/migrations/`)
- [x] `admins` table (`email text primary key`), with RLS enabled and no public access.
- [x] Helper `public.is_admin()` (security definer) that checks `auth.jwt() ->> 'email'` against `admins`.
- [x] RLS `UPDATE` policies on `people` and `dates` where `is_admin()`. Public `SELECT` stays as it is today.
- [x] Insert the two admin emails (placeholders in the file, the real values go in at apply time).
- [x] Applying the migration is a manual step for the maintainer (the SQL editor or the Supabase CLI).

### 1.2 Auth
- [x] `lib/supabase/server.ts`: cookie-based server client (user session).
- [x] `lib/supabase/middleware.ts`: session refresh helper.
- [x] Next 16 middleware (`proxy.ts` or `middleware.ts`, to be verified against the Next 16 docs) to gate `/admin/*` and redirect to `/admin/login`.
- [x] `app/admin/login/page.tsx`: email field and a "send magic link" server action.
- [x] `app/auth/callback/route.ts`: exchange the code for a session and redirect to `/admin`.
- [x] `lib/admin/requireAdmin.ts`: returns the user or throws. It is used by every admin page and server action. It checks the session and `ADMIN_EMAILS`.
- [x] Sign-out action.

### 1.3 Server actions (`app/admin/actions.ts`)
- [x] `updatePerson(id, input)` and `updateDate(id, input)`.
- [x] Each one calls `requireAdmin()`, validates the input, updates via the session client, then revalidates (see above).
- [x] Returns `{ ok: true }` or `{ ok: false, error }`. It never throws raw database errors to the client.
- [x] Validation: required fields, `http(s)` URLs for `photo_url`, `tickets_url` and `gphotos_url`, a valid `date` and `time` format, and trimmed strings with empty strings turned into `null`.

### 1.4 UI (mobile-first, Tailwind)
- [x] `app/admin/layout.tsx`: `robots: noindex`, a simple header with the user's email and sign-out.
- [x] `app/admin/page.tsx`: two entry points (People, Dates).
- [x] `app/admin/people/page.tsx`: list with search by name, and an indicator for missing `bio` and `photo_url`. This targets the alumni content gap.
- [x] `app/admin/people/[id]/page.tsx`: edit form.
- [x] `app/admin/dates/page.tsx`: upcoming and past, with a highlight for dates that have no `tickets_url`.
- [x] `app/admin/dates/[id]/page.tsx`: edit form.
- [x] Forms: single column, large touch targets (at least 44px), sticky save button, inline error and success feedback, and a pending state while saving.
- [x] Admin routes must be excluded from `app/sitemap.ts` and `robots.ts` (disallow `/admin`).

### 1.5 Tests (`__tests__/`)
- [x] `requireAdmin`: no session is rejected, an email not on the list is rejected, an allowed email passes.
- [x] Server actions: unauthenticated call is rejected, validation failures, Supabase error is turned into `{ ok: false }`, and the right `revalidateTag` / `revalidatePath` calls on success.
- [x] Forms (`@jest-environment jsdom`): render existing values, show validation errors, disable the button while pending.
- [x] Mock `@supabase/ssr` and `next/cache`, in line with the existing `__mocks__` approach.
- [x] `npm test` and `tsc --noEmit` pass. `npm run lint` is broken (`next lint` was removed in Next 16) and `npm run build` fails on `/` before this work (an `onClick` passed from a server component); both are pre-existing.

### 1.6 Docs
- [x] `MONITOR.md`: remove "CMS or admin panel" and "User authentication" from out of scope, add the admin console under current status.
- [x] `README.md`: admin setup (env vars, applying the migration, adding an admin).
- [x] `CHANGELOG.md` entry.

### 1.7 Manual verification (maintainer, on a phone and on desktop)
- [ ] (blocked on the redirect URL) Magic-link login works, and a non-allowlisted email cannot get in.
- [ ] Editing a person's `bio` changes `/attori/[slug]` without a redeploy.
- [ ] Editing a date's `tickets_url` changes the public play page and home page.
- [ ] `/admin` is not in `/sitemap.xml` and is disallowed in `/robots.txt`.
- [ ] Writing with the anon key (no session) is rejected by RLS.

---

## Lessons from increment 1 (apply to the next increments)

- **Sentinel values:** `dates.tickets_url` accepts `coming-soon` besides URLs. Check each column for special values before validating it as a URL. `plays.poster_url`, `trailer_url` and `youtube_url` are candidates to check.
- **React version in tests:** the installed React is 18.3 (Next 16 bundles its own React 19 when building), so `useActionState` does not exist under Jest. Form tests stub it, as in `__tests__/admin/forms.test.tsx`.
- **Next 16 APIs:** `proxy.ts` replaces `middleware.ts`, `revalidateTag` needs a second argument, and `updateTag` gives immediate expiry inside server actions.
- **Pre-existing failures, not caused by this work:** `next build` fails on `/` (an `onClick` passed from a server component, probably `components/play/PlayCard.tsx:84`) and `npm run lint` is broken (`next lint` was removed in Next 16). Fix the build before or at the start of increment 2, so it can be checked in CI.
- **GitHub account:** `gh` must be logged in as `albertotiribelli` (the repo owner) to open PRs.
- **Commit scope:** `admin` is not in the scopes list in `CONTRIBUTING.md`. Add it.

## Increment 2: remaining tables (PR 2)

- [ ] Fix the pre-existing `next build` failure first (see lessons above).
- [ ] Add the `admin` scope to `CONTRIBUTING.md`.
- [ ] Edit `plays` (`title`, `description`, `short_desc`, `poster_url`, `trailer_url`, `youtube_url`), with `slug` still locked.
- [ ] Edit `productions` (`season_year`, `notes`).
- [ ] Edit `performance_people` (cast and credits: `role`, `character_name`, `costume_url`, `notes`, `sort_order`).
- [ ] RLS `UPDATE` policies for each table, using the same `is_admin()`.
- [ ] Reuse the form and action patterns from increment 1 (extract shared form components if there are three or more).
- [ ] Revalidation for each table, plus tests and docs as in increment 1.

## Increment 3: create and delete (PR 3, closes #14)

- [ ] RLS `INSERT` and `DELETE` policies for admins.
- [ ] Create forms, including `slug` generation (and a uniqueness check) for new people and plays.
- [ ] Delete with a confirmation dialog. Block or warn on rows that other rows depend on (a play with productions, a production with dates, a person with cast entries), or define the cascade explicitly.
- [ ] `generateStaticParams` and sitemap pick up new slugs (revalidate the list pages and sitemap on create or delete).
- [ ] Tests for create and delete, including the dependency checks.

## Later (not committed)

- Image upload to Supabase Storage with client-side resize (the camera or gallery on a phone).
- Audit log of who changed what.

## Risks and open items

- **Magic-link email limits:** the default Supabase sender is rate-limited. Fine for two people, and the fallback is email and password.
- **Next 16 middleware naming and API changes:** resolved. It is `proxy.ts`.
- **`@supabase/ssr` with React 18.3 / Next 16:** installed (0.12.7) and typechecks. The authenticated flow is not tested yet.
- **`personal_data` exposure:** see the schema notes above.
- **Migration is manual:** applied in Supabase on 2026-10-18. RLS is the real security boundary, so test that an unauthenticated write is rejected before deploying the admin UI to production.
- **Supabase dashboard unreachable:** the redirect URL could not be saved from the dashboard. The Management API (`PATCH /v1/projects/{ref}/config/auth`, field `uri_allow_list`) is the fallback, and it replaces the whole list.

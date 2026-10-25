# Admin console: implementation plan

Issue: #14 "[Features] - Admin console" (opened 2026-10-17).

## Status (2026-10-25)

| Increment | State |
|---|---|
| 1. Edit `people` and `dates` | Done. PR #15 merged. Login works in production and the first real edit (photo album link) is live. Manual checks in 1.7 mostly done, see below. |
| 2. Remaining tables | Done. PR #18 merged. Manual checks in 2.1 still to be ticked. |
| 3. Create and delete | Code done on branch `feat/admin-console-14-increment-3` (PR closes #14). Waiting on the migration being applied in Supabase and the manual checks in 3.1. |

Open items:
- ~~Add the redirect URLs in Supabase~~ Done (2026-10-25): `https://www.lenuoveespressioni.it/auth/callback` is allowed and the magic link lands on `/admin`. Keep `http://localhost:3000/auth/callback` for local development, and add the non-`www` origin if the site is ever served from it.
- ~~Set `ADMIN_EMAILS` in Vercel~~ Done: login works in production.
- ~~Run the manual checks in 1.7~~ Mostly done (2026-10-25). Still open: editing a person's `bio`, and a login attempt with an email that is not allowed.
- Check whether the public read policy on `people` exposes `personal_data`. Partly checked on 2026-10-25: with the anon key, no `people` row has a non-null `personal_data`. That means either it is hidden or it is empty. Confirm in the Supabase SQL editor (`select count(*) from people where personal_data is not null`). If the count is above 0, it is hidden. If it is 0, it is only empty, and the policy still needs a look.

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
- [x] (confirmed 2026-10-25, after adding `https://www.lenuoveespressioni.it/auth/callback` to the Supabase redirect URLs) Magic-link login works, and a non-allowlisted email cannot get in.
- [ ] Editing a person's `bio` changes `/attori/[slug]` without a redeploy.
- [x] (2026-10-25) Editing a date changes the public play page without a redeploy. Verified with `gphotos_url`: `/spettacoli/greatest_showman` shows "Foto →" for the 2026-10-23 date. `tickets_url` on the home page was not checked separately.
- [x] (2026-10-25) `/admin` is not in `/sitemap.xml` and is disallowed in `/robots.txt`. Unauthenticated `/admin` returns 307 to `/admin/login`.
- [x] (2026-10-25) Writing with the anon key (no session) is rejected by RLS. Checked with no-op PATCH requests on a real `dates` row and a real `people` row: both returned `[]` (a permitted write returns the row). `admins` is also unreadable with the anon key.
- [x] **First real use (done 2026-10-25):** add the online photo album link to the last show. In `/admin/dates`, open the most recent past date and paste the album URL in "Link foto (Google Photos)". Then check that "Foto →" appears next to that date in the production history on `/spettacoli/[slug]`, without a redeploy. No code change is needed: `gphotos_url` is already editable in `DateForm` and rendered by `ProductionHistory`.
  - A production can have several dates, and the link is per date. If the album covers the whole run, put the same URL on each date, or ask whether a production-level link is wanted (that would be a schema change, so it belongs to increment 2 with `productions`).
  - `gphotos_url` must be an `http(s)` URL. `coming-soon` is rejected (it is only valid for `tickets_url`).
  - If the login is still blocked, the fallback is to set `dates.gphotos_url` in the Supabase dashboard. The public page then updates on the next time-based refresh (up to 24h) instead of immediately.

---

## Lessons from increment 1 (apply to the next increments)

- **Sentinel values:** `dates.tickets_url` accepts `coming-soon` besides URLs. Check each column for special values before validating it as a URL. `plays.poster_url`, `trailer_url` and `youtube_url` are candidates to check.
- **React version in tests:** the installed React is 18.3 (Next 16 bundles its own React 19 when building), so `useActionState` does not exist under Jest. Form tests stub it, as in `__tests__/admin/forms.test.tsx`.
- **Next 16 APIs:** `proxy.ts` replaces `middleware.ts`, `revalidateTag` needs a second argument, and `updateTag` gives immediate expiry inside server actions.
- **Pre-existing failures, not caused by this work:** `next build` fails on `/` (an `onClick` passed from a server component, probably `components/play/PlayCard.tsx:84`) and `npm run lint` is broken (`next lint` was removed in Next 16). Fix the build before or at the start of increment 2, so it can be checked in CI.
- **GitHub account:** `gh` must be logged in as `albertotiribelli` (the repo owner) to open PRs.
- **Commit scope:** `admin` is not in the scopes list in `CONTRIBUTING.md`. Add it.

## Increment 2: remaining tables (PR 2)

- [x] Fix the pre-existing `next build` failure first. Already fixed on `main` by `600cb3f` (`'use client'` on `PlayCard`): `npm run build` passes, including the new admin routes.
- [x] Add the `admin` scope to `CONTRIBUTING.md`.
- [x] Edit `plays` (`title`, `description`, `short_desc`, `poster_url`, `trailer_url`, `youtube_url`), with `slug` still locked. Pages: `/admin/plays`, `/admin/plays/[id]`.
- [x] Edit `productions` (`season_year`, `notes`). Page: `/admin/productions/[id]`, reached from the play page. `play_id` is locked.
- [x] Edit `performance_people` (`role`, `character_name`, `sort_order`, `costume_url`, `notes`). Pages: `/admin/dates/[id]/cast` and `/admin/dates/[id]/cast/[entryId]`, reached from the date page. `date_id` and `person_id` are locked.
- [x] RLS `UPDATE` policies for each table, using the same `is_admin()`: `supabase/migrations/20261025000000_admin_console_increment_2.sql`.
- [x] Reuse the form and action patterns from increment 1. The five update actions now share `runUpdate` in `app/admin/actions.ts`, and `Field` gained a `select` (`options`) and a `number` type.
- [x] Revalidation for each table, plus tests and docs (README, CHANGELOG, MONITOR). `tsc --noEmit` is clean, `npm test` has 145 passing tests and `npm run build` passes.

Design notes:
- **Cast is edited per date**, because `performance_people` rows hang off a date (1233 rows in total, over the PostgREST default of 1000 per request, so there is no global list). Editing the same role across a whole run means editing each date.
- **`role` is a select** limited to `actor`, `director`, `technician` and `other`, the only values in the data. A row holding another value keeps it in the select until it is changed.
- **`costume_url`** holds empty strings in some rows. An empty value is saved as `null`.
- **`plays` URL columns** have no sentinel values (all existing values are full `http(s)` URLs), so they are validated as plain URLs.
- **`plays.slug` and `productions.season_year`:** `season_year` is user-visible (the `?year=` tab and headings), so it is editable and required. `slug` stays locked.

### 2.1 Manual verification (maintainer)
- [ ] Apply `supabase/migrations/20261025000000_admin_console_increment_2.sql` in the Supabase SQL editor. Without it every save in increment 2 fails with "permessi insufficienti".
- [ ] Edit a play's `short_desc` and check `/spettacoli` and `/spettacoli/[slug]` without a redeploy.
- [ ] Edit a production's `notes` and check the production history on `/spettacoli/[slug]`.
- [ ] Edit a cast entry (for example `character_name`) and check the cast list on `/spettacoli/[slug]` and the person page on `/attori/[slug]`.
- [ ] Anon-key writes to `plays`, `productions` and `performance_people` are rejected (repeat the no-op PATCH check from 1.7 after applying the migration).
- [ ] Try the new pages on a phone: `/admin/plays` → a play → a production → a date → *Cast e crediti*.

## Increment 3: create and delete (PR 3, closes #14)

- [x] RLS `INSERT` and `DELETE` policies for admins on all five tables: `supabase/migrations/20261026000000_admin_console_increment_3.sql`.
- [x] Create forms. The edit forms double as create forms (no row means create). New pages: `/admin/people/new`, `/admin/plays/new`, `/admin/plays/[id]/productions/new`, `/admin/productions/[id]/dates/new` and `/admin/dates/[id]/cast/new` (with a person picker). Each list or parent page has a "+ Nuova" button. After creating, the admin lands on the new row.
- [x] Slug generation for new people and plays (`lib/admin/slug.ts`): lowercase, accents removed, underscores like the existing slugs (`alberto_tiribelli`), then `_2`, `_3` if the slug is taken. A database duplicate-key error is reported as "Esiste già una voce uguale". Slugs stay locked after creation.
- [x] Delete with an inline two-step confirmation (`DeleteButton`) on every edit page.
- [x] Dependencies: **delete is blocked, not cascaded.** The app counts dependent rows first and refuses with a message: a person in cast entries, a play with productions, a production with dates, a date with cast entries. Cast entries have no dependents, so they can always be deleted. This does not rely on the database foreign key rules (not visible from the app). Deleting a whole production therefore means deleting its cast entries and dates first.
- [x] New slugs reach the public site: `generateStaticParams` pages render on demand for unknown slugs (`dynamicParams`), and create and delete call `revalidatePath` for the list pages, the `[slug]` pages and `/sitemap.xml`.
- [x] Tests for slugs, validation, create and delete actions (including the dependency checks, denied writes and hidden database errors), create-mode forms and `DeleteButton`. `tsc --noEmit` is clean, `npm test` has 191 passing tests and `npm run build` passes.
- [x] Docs: README, CHANGELOG, MONITOR.
- [x] **Copy cast between dates** (follow-up PR, stacked on this one): the cast list of a date has a form to copy the cast of another date of the same production. It skips entries already on the date (same person, role and character) and inserts in one statement (all or nothing). It uses the increment 3 insert policy, so there is no new migration.

Design notes:
- A cast entry belongs to one date. For a run with the same cast, add the cast once and copy it to the other dates.
- The `FormShell` bottom padding moved to the admin layout, so a delete block can follow a form without a large gap.

### 3.1 Manual verification (maintainer)
- [ ] Apply `supabase/migrations/20261026000000_admin_console_increment_3.sql` in the Supabase SQL editor.
- [ ] Create a test person from `/admin/people/new`, check `/attori/<slug>` (it may take a moment to render the first time) and `/sitemap.xml`, then delete the person and check the page is gone.
- [ ] Create a test play, add a production, add a date to it and add a cast entry. Check each appears on `/spettacoli/<slug>`, then delete in reverse order (cast entry, date, production, play).
- [ ] Try to delete a person who is in a cast, and a play with productions: both must be refused with a message and nothing deleted.
- [ ] Anon-key insert and delete are rejected by RLS on all five tables (no-op style check, as in 1.7, with a row that is safe to remove or a deliberately invalid insert).
- [ ] Copy a cast: on a date with no cast, copy from another date of the same production, check the entries and `/spettacoli/<slug>`, then copy again and check it is refused with "già presenti". Try it on a date that already has some entries, to see that only the missing ones are added.
- [ ] Try creating, deleting and copying on a phone.

## Later (not committed)

- Edit the cast of a whole production at once (bulk edit across dates).
- Image upload to Supabase Storage with client-side resize (the camera or gallery on a phone).
- Audit log of who changed what.

## Risks and open items

- **Magic-link email limits:** the default Supabase sender is rate-limited. Fine for two people, and the fallback is email and password.
- **Next 16 middleware naming and API changes:** resolved. It is `proxy.ts`.
- **`@supabase/ssr` with React 18.3 / Next 16:** installed (0.12.7) and typechecks. The authenticated flow is not tested yet.
- **`personal_data` exposure:** see the schema notes above.
- **`robots.txt` sitemap URL has a double slash** (`https://www.lenuoveespressioni.it//sitemap.xml`). Pre-existing and minor. Fix it in `app/robots.ts` (probably a trailing slash in the site URL env var or constant).
- **Migration is manual:** applied in Supabase on 2026-10-18. RLS is the real security boundary, so test that an unauthenticated write is rejected before deploying the admin UI to production.
- **Supabase dashboard unreachable:** the redirect URL could not be saved from the dashboard. The Management API (`PATCH /v1/projects/{ref}/config/auth`, field `uri_allow_list`) is the fallback, and it replaces the whole list.

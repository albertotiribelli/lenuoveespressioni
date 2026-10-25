# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Admin console: copy cast between dates.** The cast list of a date has a "Copia il cast da un'altra data" form that copies the cast entries of another date of the same production. Entries already on the date (same person, role and character) are skipped, and the copy is a single insert, so it either copies everything or nothing. No new migration: it uses the increment 3 insert policy
- **Admin console, increment 3** (issue #14): create and delete people, plays, productions (from a play), dates (from a production) and cast entries (from a date). New people and plays get a slug generated from the name or title (`mario_rossi`, `mario_rossi_2` if taken). Deleting asks for confirmation and is blocked while other rows depend on the row (a person in a cast, a play with productions, a production with dates, a date with cast entries). Create and delete revalidate the public pages and `/sitemap.xml`
- `supabase/migrations/20261026000000_admin_console_increment_3.sql`: RLS `INSERT` and `DELETE` policies for `people`, `dates`, `plays`, `productions` and `performance_people`
- **Admin console, increment 2** (issue #14): edit `plays` (title, descriptions, poster, trailer and YouTube URLs), `productions` (season, notes) and `performance_people` (role, character, order, costume URL, notes) from `/admin/plays`, `/admin/productions/[id]` and `/admin/dates/[id]/cast`. Slugs and foreign keys stay locked
- `supabase/migrations/20261025000000_admin_console_increment_2.sql`: RLS `UPDATE` policies for `plays`, `productions` and `performance_people`
- `admin` commit scope in `CONTRIBUTING.md`
- **Admin console** (`/admin`, issue #14, increment 1): magic-link login (Supabase Auth, restricted to `ADMIN_EMAILS` and the `admins` table), mobile-first forms to edit existing `people` and `dates` rows; saves revalidate the public pages on demand, so no redeploy is needed. `/admin` is `noindex`, disallowed in `robots.txt` and gated by `proxy.ts`
- `supabase/migrations/20261018000000_admin_console.sql`: `admins` table, `is_admin()` and RLS `UPDATE` policies for `people` and `dates`
- Tests for the admin guard, validation, server actions and forms
- Canonical URL tag and `og:image` meta tag on every page
- Home page metadata export (was inheriting root layout defaults only)
- `getPlaySlugs` and `getPersonSlugs` lightweight queries for `generateStaticParams`

### Changed
- **Performance (#7, #11, #16):** `/attori` is now statically rendered (ISR, 1 h) instead of running a function on every request. The hidden company history (`?edespressionisimili`) is switched on in the browser and loads its data from the new cached `/api/attori/timeline`, so regular visits never pay for it. `vercel.json` pins the functions to `dub1` (Dublin), next to the Supabase database (AWS eu-west-1); they ran in `iad1` (US East) by default, so every query crossed the Atlantic
- Admin server actions share one `runUpdate` helper (admin check, id and input validation, update through the session client, revalidation)
- `/spettacoli/[slug]`: drops `searchParams` prop, enabling ISR; `?year=` tab is now initialised client-side via `useEffect` after hydration
- `/spettacoli/[slug]` and `/attori/[slug]`: `generateStaticParams` pre-renders all pages at deploy time; `revalidate = 3600` keeps them fresh
- All static pages (`/`, `/spettacoli`, `/archivio`, `/media`, `/chi-siamo`, `/contatti`): `revalidate` added (300 s on home, 3600 s on content pages, 86400 s on near-static pages) — pages now served from CDN edge after first request
- `/attori` cached queries now carry cache tags (`people`, `dates`) so admin saves can invalidate them
- `/attori` queries (`getPeople`, `getPeopleTimeline`) wrapped with `unstable_cache(3600)` — DB round-trip skipped on cached hits even though the page remains dynamic

---

## [0.2.0] — 2026-05-20

### Added
- **Chi Siamo**: full company history (2007–2026) replacing the short placeholder text; show titles linked to their `/spettacoli` pages
- **Ticket links**: `tickets_url` column on the `dates` table; sentinel value `coming-soon` shows "Biglietti disponibili a breve", any URL renders an active "Acquista biglietti" button — on both the home page cards and the play page date list
- **Date strategy on home page**: three-tier display — near future (≤ 60 days, full style), far future (> 60 days, "In programma" badge), recent past (≤ 14 days, dimmed "Conclusa" badge); section heading adapts accordingly
- **Compagnia page** (`/attori`): circular avatar grid for all members with role-filter tabs (Tutti / Attori / Registi / Tecnici / Collaboratori), active/alumni sections, sorted alphabetically by last name
- **Secret membership timeline** (`/attori?edespressionisimili`): Wikipedia-style horizontal bar chart showing each member's years of participation per calendar year, colour-coded by role, consecutive years merged into a single bar
- **"Compagnia" nav link** in the header pointing to `/attori`
- **SEO**: per-page `title`, `description`, and Open Graph tags on all static and dynamic pages; `title.template` in root layout; `metadataBase`; `sitemap.xml`; `robots.txt`; canonical URLs stripping `?year=` variants; `getPlayMeta` / `getPersonMeta` lightweight queries to avoid over-fetching during metadata generation
- **`?year=` deep linking**: clicking a production in the actor timeline or the archive pre-selects the correct cast tab on the play page
- **Year tabs** on play pages for multi-production shows, with hover-sync between the tab bar and the cast list
- **Multiple roles per person per production**: composite cast map key (`person_id|role|character_name`) correctly handles the same person appearing in different roles on different dates

### Changed
- Date query now uses date-only comparison (`.slice(0, 10)`) to avoid timestamp/date type mismatch with Supabase
- `getUpcomingDates` window extended to 14 days in the past

### Fixed
- Blank space at the bottom of pages on mobile (iOS Safari `100vh` vs. `dvh`): `min-h-screen` → `min-h-dvh` on `<body>`
- UTC date formatting in `PlayCard` to prevent React hydration mismatch (CLS)
- `never` union branches in generated Supabase types (`Enums`, `CompositeTypes`)

---

## [0.1.0] — 2025-12-01

### Added
- Initial Next.js App Router site replacing the old static HTML site
- Pages: home (hero + upcoming dates + trailers), `/spettacoli`, `/spettacoli/[slug]`, `/attori`, `/attori/[slug]`, `/archivio`, `/media`, `/chi-siamo`, `/contatti`
- Supabase data layer: `getPlays`, `getPeople`, `getPersonBySlug`, `getPlayBySlug`, `getUpcomingDates`, `getAllProductions`
- Dark theme with Cinzel (serif) + Lato typography and custom CSS variable palette
- Costume photo swap on hover/tap for actor profiles
- Cast sorted by `sort_order`; one entry per date with costume URL per row
- Archive timeline with venue deduplication and revalidate endpoint
- Notes displayed in `DatesList`, `ProductionHistory`, and `ArchiveTimeline`
- Responsive hamburger menu for mobile
- Favicons for all device sizes
- Vercel Analytics and Speed Insights
- `CONTRIBUTING.md` with Conventional Commits guide

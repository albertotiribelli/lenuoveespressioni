# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- Canonical URL tag and `og:image` meta tag on every page
- Home page metadata export (was inheriting root layout defaults only)

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

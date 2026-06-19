# Le Nuove Espressioni

Website for **Le Nuove Espressioni**, a theatre company based in Bovisio Masciago (MB), active since 2007.

Built with Next.js 16 (App Router), Supabase, and Tailwind CSS. Deployed on Vercel.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — upcoming dates, trailers |
| `/spettacoli` | Full play catalogue |
| `/spettacoli/[slug]` | Play detail — poster, description, cast, dates |
| `/attori` | Company members grid with role filter |
| `/attori/[slug]` | Person profile — bio, performance history |
| `/archivio` | Production archive timeline |
| `/media` | Trailer gallery |
| `/chi-siamo` | Company history |
| `/contatti` | Contact info |

### Easter egg

`/attori?edespressionisimili` shows a Wikipedia-style membership timeline with one column per calendar year.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| Fonts | Cinzel (serif) + Lato via `next/font` |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel |

---

## Local Development

**Prerequisites**: Node.js 20+, a Supabase project.

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL

# Start dev server
npm run dev
```

### Available commands

```bash
npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build locally
npm run lint     # ESLint
npm test         # Jest unit tests
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical base URL (e.g. `https://lenuoveespressioni.it`) — used for sitemap and Open Graph |

---

## Database

Managed in Supabase. Key tables:

| Table | Description |
|---|---|
| `plays` | Show catalogue (title, slug, poster, description) |
| `productions` | One production per show per season year |
| `dates` | Individual performance dates, linked to a production |
| `people` | Company members (actors, directors, technicians) |
| `performance_people` | Join table: who appeared on which date, in which role |

The `dates.tickets_url` column controls ticket links: `null` hides the button, `'coming-soon'` shows a preview label, any URL renders an active link.

---

## Project Structure

```
app/                  # Next.js App Router pages and layouts
components/
  layout/             # Header, Footer
  play/               # PlayCard, SpettacoloBody, DatesList, …
  person/             # PersonCard, PeopleGrid, MembershipTimeline, …
  ui/                 # UpcomingDatesSection, ArchiveTimeline, …
lib/                  # Data-fetching helpers (getPlays, getPeople, …)
types/                # Shared TypeScript interfaces
__tests__/            # Jest unit tests
public/               # Static assets (logo, favicons)
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit conventions and scope guide.
See [CHANGELOG.md](./CHANGELOG.md) for version history.

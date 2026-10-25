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
| `ADMIN_EMAILS` | ✅ for `/admin` | Comma-separated emails allowed to log in to the admin console |

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

## Admin console

`/admin` lets the maintainers create, edit and delete `people`, `dates`, `plays`, `productions` and the cast and credits of each date (`performance_people`), including from a phone, instead of using the Supabase dashboard. It is `noindex` and not in the sitemap.

Setup:
1. In Supabase, enable the Email provider (magic link) and add `<site url>/auth/callback` to the allowed redirect URLs.
2. Edit the placeholder emails in `supabase/migrations/20261018000000_admin_console.sql`, then run it in the Supabase SQL editor (or with the CLI). Then run `supabase/migrations/20261025000000_admin_console_increment_2.sql`, which adds the update policies for `plays`, `productions` and `performance_people`. Finally run `supabase/migrations/20261026000000_admin_console_increment_3.sql` (insert and delete policies for all five tables).
3. Set `ADMIN_EMAILS` locally and in Vercel (same emails as the `admins` table).
4. Open `/admin` and request a login link.

To add an admin: insert a row in `public.admins` **and** add the email to `ADMIN_EMAILS`. Writes are authorized by RLS (`is_admin()`), and server actions re-check the session; the service-role key is never used.

Navigation: **Spettacoli** → a play (edit it and open its productions) → a production (edit it and open its dates); **Date** → a date → *Cast e crediti* (edit each cast or crew entry). Slugs, ids and links between rows are read-only.

Creating: the **+ Nuova** buttons are on the lists (people, plays), on a play (productions), on a production (dates) and on a date's cast list. The slug of a new person or play is generated from the name or title (`mario_rossi`, then `mario_rossi_2` if taken) and never changes afterwards. Deleting: every edit page ends with an *Elimina* button that asks for confirmation. A row that others depend on cannot be deleted: a person in a cast, a play with productions, a production with dates, a date with cast entries. Delete the dependents first (cast entries can always be deleted).

Saving an edit revalidates the affected public pages on demand (`updateTag` / `revalidatePath`), so no redeploy is needed.

---

## Project Structure

```
app/                  # Next.js App Router pages and layouts
components/
  layout/             # Header, Footer
  play/               # PlayCard, SpettacoloBody, DatesList, …
  person/             # PersonCard, PeopleGrid, MembershipTimeline, …
  ui/                 # UpcomingDatesSection, ArchiveTimeline, …
  admin/              # Admin forms and fields
lib/                  # Data-fetching helpers (getPlays, getPeople, …)
  admin/              # requireAdmin guard, form validation
  supabase/           # Cookie-based Supabase clients for the admin session
supabase/migrations/  # SQL to apply manually in Supabase
proxy.ts              # Gates /admin/* (Next 16 successor of middleware)
types/                # Shared TypeScript interfaces
__tests__/            # Jest unit tests
public/               # Static assets (logo, favicons)
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit conventions and scope guide.
See [CHANGELOG.md](./CHANGELOG.md) for version history.

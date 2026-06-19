# Contributing

This is a personal project, but these conventions keep the git history readable and the changelog easy to maintain.

## Tech Stack

- **Framework**: Next.js 16 (App Router, server components)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature or page |
| `fix` | A bug fix |
| `content` | Copy/text changes with no code change |
| `style` | Visual/UI tweaks with no logic change |
| `chore` | Maintenance, dependency updates, config |
| `docs` | Documentation only (README, CHANGELOG, CONTRIBUTING) |
| `refactor` | Code restructuring with no behaviour change |
| `perf` | Performance improvement |

### Scopes

| Scope | What it covers |
|---|---|
| `home` | `app/page.tsx` and home-page components |
| `spettacoli` | Play listing and detail pages |
| `attori` | Person listing and detail pages |
| `compagnia` | `/attori` page (grid + secret timeline) |
| `archivio` | Archive timeline page |
| `media` | Media/trailer page |
| `chi-siamo` | About page |
| `contatti` | Contact page |
| `seo` | Metadata, Open Graph, sitemap, robots, canonical |
| `layout` | Header, footer, root layout |
| `design` | Global styles, typography, colour palette |
| `types` | TypeScript types and generated DB types |
| `lib` | Data-fetching helpers in `lib/` |
| `tickets` | Ticket link feature on dates |
| `timeline` | Membership timeline easter egg |
| `analytics` | Vercel Analytics / Speed Insights |

### Examples

```
feat(spettacoli): add year tabs for multi-production cast
fix(layout): use min-h-dvh to eliminate blank space on mobile
content(chi-siamo): replace history text with full company story
style(archive): highlight date notes in accent colour
chore(deps): bump next to 16.3.0
docs: update CHANGELOG for v0.2.0
```

### Rules

- Use the **imperative mood**: "add", not "added" or "adds"
- Keep the first line **under 72 characters**
- Do **not** end the description with a period
- Breaking changes get a `!` after the type: `feat(lib)!: change getPlays return shape`

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL (e.g. `https://lenuoveespressioni.it`) |

## Changelog

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and is updated manually alongside significant milestones.

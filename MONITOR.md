# Monitor Context

> This file gives the Project Monitor agent product context beyond what
> is visible in code metrics.

## What this project is

The official website of **Le Nuove Espressioni**, a theatre company based
in Bovisio Masciago (MB), active since 2007. Built with Next.js 16 (App
Router), Supabase (PostgreSQL), and Tailwind CSS. Deployed on Vercel at
[lenuoveespressioni.it](https://www.lenuoveespressioni.it/).

The site is maintained by a single developer and is the primary public
presence of the company: upcoming dates, full play catalogue, company
members, archive, trailers, and company history.

## Current status

Live in production. Core feature set complete:
- Play pages with cast, production history, upcoming dates, and ticket links
- Company member grid with role filter and active/alumni sections
- Hidden membership timeline easter egg (`?edespressionisimili`)
- Three-tier date strategy (near future / far future / recent past)
- ISR caching on all static routes; `unstable_cache` on dynamic ones
- Full SEO: per-page metadata, Open Graph, sitemap, robots.txt, canonical URLs

## Active work

- Content population: alumni members are missing bios and photos — the
  data exists in Supabase but the `bio` and `photo_url` fields are blank
  for many non-active people
- Ticket link rollout: `dates.tickets_url` column is live; the October
  2026 show date needs a real URL once the theater publishes it

## Roadmap (next meaningful steps)

- **Press / news section**: a simple `/news` page for announcements,
  press mentions, and post-show recaps — likely sourced from a new
  Supabase table or markdown files
- **Real og:image**: replace the logo fallback (`/logo.png`) with a
  proper 1200×630 share image for social previews on static pages
- **Old site redirect**: configure `.htaccess` on the Altervista host
  (`lenuoveespressioni.altervista.org`) to 301 to the new domain

## Known pain points

- Alumni member profiles are sparse: `bio` and `photo_url` are null for
  most non-active members, so their profile pages show minimal content
- `NEXT_PUBLIC_SITE_URL` must be set in Vercel environment variables for
  canonical URLs and sitemap to point to the correct production domain

## Out of scope (don't suggest these)

- CMS or admin panel for content editing (Supabase dashboard is sufficient)
- User authentication or member login area
- Booking or ticketing system (links to the theater's own system)
- Newsletter or email delivery infrastructure

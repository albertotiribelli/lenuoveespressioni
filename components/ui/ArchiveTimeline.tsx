import Link from 'next/link'

interface ArchiveProduction {
  id: string
  season_year: string
  notes: string | null
  plays: {
    title: string
    slug: string
    poster_url: string | null
    short_desc: string | null
  }
  dates: {
    id: string
    date: string
    time: string | null
    theater_name: string
    city: string | null
  }[]
}

interface ArchiveTimelineProps {
  productions: ArchiveProduction[]
}

export default function ArchiveTimeline({ productions }: ArchiveTimelineProps) {
  return (
    <ol className="space-y-8 border-l-2 border-[var(--border)] pl-8">
      {productions.map((prod) => {
        const count = prod.dates.length
        const countLabel = count === 1 ? '1 data' : `${count} date`
        const venues = [...new Set(prod.dates.map((d) => `${d.theater_name}${d.city ? `, ${d.city}` : ''}`))]

        return (
          <li key={prod.id} className="relative">
            <span className="absolute -left-[2.125rem] top-1.5 h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)]" />
            <span className="font-mono text-sm text-[var(--accent)] uppercase tracking-widest">
              {prod.season_year}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <Link
                href={`/spettacoli/${prod.plays.slug}`}
                className="font-serif text-xl text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                {prod.plays.title}
              </Link>
              <span className="text-xs text-[var(--text-muted)]">{countLabel}</span>
            </div>
            <ul className="mt-2 space-y-0.5">
              {venues.map((v) => (
                <li key={v} className="text-sm text-[var(--text-muted)]">{v}</li>
              ))}
            </ul>
          </li>
        )
      })}
    </ol>
  )
}

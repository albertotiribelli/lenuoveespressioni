import Link from 'next/link'

interface HistoryEntry {
  character_name: string | null
  role: string
  notes: string | null
  dates: {
    date: string
    theater_name: string
    city: string | null
    productions: {
      season_year: string
      plays: {
        title: string
        slug: string
      }
    }
  }
}

interface CompanyTimelineProps {
  history: HistoryEntry[]
}

export default function CompanyTimeline({ history }: CompanyTimelineProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Nessuna partecipazione registrata.</p>
    )
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.dates.date).getTime() - new Date(a.dates.date).getTime()
  )

  return (
    <ol className="space-y-4 border-l-2 border-[var(--border)] pl-6">
      {sorted.map((entry, i) => {
        const { plays, season_year } = entry.dates.productions
        return (
          <li key={i} className="relative">
            <span className="absolute -left-[1.625rem] top-1.5 h-3 w-3 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider">
              {season_year}
            </span>
            <div className="mt-1">
              <Link
                href={`/spettacoli/${plays.slug}`}
                className="font-serif text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                {plays.title}
              </Link>
              {entry.character_name && (
                <span className="ml-2 text-sm text-[var(--text-muted)] italic">
                  {entry.role === 'actor' ? 'nei panni di' : 'come'} {entry.character_name}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

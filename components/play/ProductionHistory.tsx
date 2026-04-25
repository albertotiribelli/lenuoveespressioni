'use client'

interface DateEntry {
  id: string
  date: string
  time: string | null
  theater_name: string
  city: string | null
  gphotos_url?: string | null
  notes?: string | null
}

interface Production {
  id: string
  season_year: string
  notes: string | null
  dates: DateEntry[]
}

interface ProductionHistoryProps {
  readonly productions: Production[]
  readonly activeYear?: string | null
  readonly onProductionHover?: (year: string | null) => void
}

export default function ProductionHistory({ productions, activeYear, onProductionHover }: ProductionHistoryProps) {
  return (
    <div className="space-y-6">
      {productions.map((prod) => {
        const count = prod.dates.length
        const countLabel = count === 1 ? '1 data' : `${count} date`
        const isActive = activeYear == null || activeYear === prod.season_year

        return (
          <div
            key={prod.id}
            className={`border-l-2 pl-4 transition-opacity duration-200 ${isActive ? 'border-[var(--accent)] opacity-100' : 'border-[var(--border)] opacity-40'}`}
            onMouseEnter={() => onProductionHover?.(prod.season_year)}
            onMouseLeave={() => onProductionHover?.(null)}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-xl text-[var(--accent)]">{prod.season_year}</span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{countLabel}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {[...prod.dates].sort((a, b) => a.date.localeCompare(b.date)).map((d) => {
                const formatted = new Date(d.date).toLocaleDateString('it-IT', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })
                return (
                  <li key={d.id} className="text-sm text-[var(--text-muted)]">
                    {formatted}
                    {d.time && <span> ore {d.time.slice(0, 5)}</span>}
                    {' — '}
                    <span>{d.theater_name}</span>
                    {d.city && <span>, {d.city}</span>}
                    {d.notes && (
                      <span className="ml-2 italic text-[var(--text-muted)]">{d.notes}</span>
                    )}
                    {d.gphotos_url && (
                      <a
                        href={d.gphotos_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-[var(--accent)] hover:underline"
                      >
                        Foto →
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

import type { PerformanceDate } from '@/types'
import { formatDateItLongWithWeekday } from '@/lib/formatDate'

interface DatesListProps {
  dates: PerformanceDate[]
}

export default function DatesList({ dates }: DatesListProps) {
  if (dates.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Nessuna data in programma al momento.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {dates.map((d) => {
        const formattedDate = formatDateItLongWithWeekday(d.date)

        return (
          <li key={d.id} className="py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[var(--accent)] font-medium">{formattedDate}</span>
                {d.time && (
                  <span className="ml-2 text-sm text-[var(--text-muted)]">
                    ore {d.time.slice(0, 5)}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 text-right text-sm text-[var(--text-muted)]">
                <span>
                  {d.theater_name}
                  {d.city && `, ${d.city}`}
                </span>
                {d.tickets_url && (
                  d.tickets_url === 'coming-soon'
                    ? <span className="text-xs italic opacity-60">Biglietti disponibili a breve</span>
                    : (
                      <a
                        href={d.tickets_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm border border-[var(--accent)] px-3 py-0.5 text-xs uppercase tracking-wider text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                      >
                        Acquista biglietti →
                      </a>
                    )
                )}
              </div>
            </div>
            {d.notes && (
              <p className="mt-1 text-xs italic text-[var(--text-muted)]">{d.notes}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}

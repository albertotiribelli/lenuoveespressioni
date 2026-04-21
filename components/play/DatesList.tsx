import type { PerformanceDate } from '@/types'

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
        const dateObj = new Date(d.date)
        const formattedDate = dateObj.toLocaleDateString('it-IT', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        return (
          <li key={d.id} className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[var(--accent)] font-medium">{formattedDate}</span>
                {d.time && (
                  <span className="ml-2 text-sm text-[var(--text-muted)]">
                    ore {d.time.slice(0, 5)}
                  </span>
                )}
              </div>
              <div className="text-right text-sm text-[var(--text-muted)]">
                <span>{d.theater_name}</span>
                {d.city && <span>, {d.city}</span>}
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

import Link from 'next/link'

interface CastEntry {
  character_name: string | null
  role: string
  people: {
    id: string
    slug: string
    name: string
    photo_url: string | null
  }
  onlyDate?: string | null
}

interface CastListProps {
  cast: CastEntry[]
}

export default function CastList({ cast }: CastListProps) {
  if (cast.length === 0) return null

  return (
    <ul className="divide-y divide-[var(--border)]">
      {cast.map((entry) => {
        const dateLabel = entry.onlyDate
          ? new Date(entry.onlyDate).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : null

        return (
          <li key={entry.people.id} className="grid grid-cols-2 gap-4 py-3 items-start">
            <span className="text-[var(--text-muted)] italic">{entry.character_name}</span>
            <div className="text-right">
              <Link
                href={`/attori/${entry.people.slug}`}
                className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                {entry.people.name}
              </Link>
              {dateLabel && (
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {dateLabel}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

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
}

interface CastListProps {
  cast: CastEntry[]
}

export default function CastList({ cast }: CastListProps) {
  if (cast.length === 0) return null

  return (
    <ul className="divide-y divide-[var(--border)]">
      {cast.map((entry) => (
        <li key={entry.people.id} className="flex items-center justify-between py-3">
          <span className="text-[var(--text-muted)] italic">{entry.character_name}</span>
          <Link
            href={`/attori/${entry.people.slug}`}
            className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            {entry.people.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

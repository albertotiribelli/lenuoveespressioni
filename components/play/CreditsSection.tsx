import Link from 'next/link'

interface CreditEntry {
  character_name: string | null
  role: string
  onlyDate: string | null
  people: {
    id: string
    slug: string
    name: string
    photo_url: string | null
  }
}

interface CreditsSectionProps {
  credits: CreditEntry[]
}

const ROLE_ORDER = ['director', 'actor', 'technician', 'other'] as const

const ROLE_LABELS: Record<string, string> = {
  director:   'Regia',
  actor:      'Cast',
  technician: 'Tecnici',
  other:      'Collaboratori',
}

export default function CreditsSection({ credits }: CreditsSectionProps) {
  const grouped = ROLE_ORDER.reduce<Record<string, CreditEntry[]>>((acc, role) => {
    const entries = credits.filter((c) => c.role === role)
    if (entries.length > 0) acc[role] = entries
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {(Object.entries(grouped) as [string, CreditEntry[]][]).map(([role, entries]) => (
        <section key={role}>
          <h3 className="mb-3 text-xs uppercase tracking-widest text-[var(--accent)]">
            {ROLE_LABELS[role] ?? role}
          </h3>

          {role === 'actor' ? (
            <ul className="divide-y divide-[var(--border)]">
              {entries.map((entry) => {
                const dateLabel = entry.onlyDate
                  ? new Date(entry.onlyDate).toLocaleDateString('it-IT', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })
                  : null

                return (
                  <li key={`${entry.people.id}-${entry.character_name ?? ''}`} className="grid grid-cols-2 gap-4 py-3 items-start">
                    <span className="italic text-[var(--text-muted)]">{entry.character_name}</span>
                    <div className="text-right">
                      <Link
                        href={`/attori/${entry.people.slug}`}
                        className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                      >
                        {entry.people.name}
                      </Link>
                      {dateLabel && (
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{dateLabel}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <ul className="space-y-2">
              {entries.map((entry) => (
                <li key={`${entry.people.id}-${entry.character_name ?? ''}`}>
                  <Link
                    href={`/attori/${entry.people.slug}`}
                    className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                  >
                    {entry.people.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}

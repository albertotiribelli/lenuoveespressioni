import Link from 'next/link'
import Image from 'next/image'

const ROLE_LABELS: Record<string, string> = {
  actor: 'Attore',
  director: 'Regista',
  technician: 'Tecnico',
  other: 'Collaboratore',
}

interface PersonSummary {
  id: string
  slug: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  is_active: boolean | null
  joined_at: string
}

interface PersonCardProps {
  person: PersonSummary
}

export default function PersonCard({ person }: PersonCardProps) {
  return (
    <Link
      href={`/attori/${person.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--card-bg)] transition-colors hover:border-[var(--accent)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--border)]">
        {person.photo_url ? (
          <Image
            src={person.photo_url}
            alt={person.name}
            fill
            className="object-cover object-top transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            aria-label="Foto non disponibile"
            className="flex h-full w-full items-center justify-center text-[var(--text-muted)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h2 className="font-serif text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          {person.name}
        </h2>
        <span className="text-xs uppercase tracking-wider text-[var(--accent)]">
          {ROLE_LABELS[person.role] ?? person.role}
        </span>
      </div>
    </Link>
  )
}

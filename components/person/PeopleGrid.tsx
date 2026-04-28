'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ROLE_LABELS: Record<string, string> = {
  actor: 'Attore',
  director: 'Regista',
  technician: 'Tecnico',
  other: 'Collaboratore',
}

const TABS = [
  { key: 'all', label: 'Tutti' },
  { key: 'actor', label: 'Attori' },
  { key: 'director', label: 'Registi' },
  { key: 'technician', label: 'Tecnici' },
  { key: 'other', label: 'Collaboratori' },
]

interface Person {
  id: string
  slug: string
  name: string
  role: string
  photo_url: string | null
}

interface Props {
  active: Person[]
  alumni: Person[]
}

function PersonAvatar({ person }: { person: Person }) {
  const initials = person.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Link href={`/attori/${person.slug}`} className="group flex flex-col items-center gap-2 text-center">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-transparent bg-[var(--border)] transition-colors group-hover:border-[var(--accent)]">
        {person.photo_url ? (
          <Image
            src={person.photo_url}
            alt={person.name}
            fill
            className="object-cover object-top"
            sizes="80px"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-lg text-[var(--text-muted)]">
            {initials}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm leading-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
          {person.name}
        </p>
        <p className="mt-0.5 text-xs uppercase tracking-wider text-[var(--accent)]">
          {ROLE_LABELS[person.role] ?? person.role}
        </p>
      </div>
    </Link>
  )
}

export default function PeopleGrid({ active, alumni }: Props) {
  const [tab, setTab] = useState('all')

  const filter = (list: Person[]) =>
    tab === 'all' ? list : list.filter((p) => p.role === tab)

  const filteredActive = filter(active)
  const filteredAlumni = filter(alumni)
  const hasAlumni = alumni.length > 0

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-sm border px-3 py-1 text-xs transition-colors ${
              tab === t.key
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredActive.length > 0 && (
        <section className={hasAlumni ? 'mb-14' : ''}>
          {hasAlumni && (
            <h2 className="mb-6 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
              Compagnia attiva
            </h2>
          )}
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {filteredActive.map((p) => (
              <PersonAvatar key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}

      {filteredAlumni.length > 0 && (
        <section>
          <h2 className="mb-6 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Alumni</h2>
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {filteredAlumni.map((p) => (
              <PersonAvatar key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}

      {filteredActive.length === 0 && filteredAlumni.length === 0 && (
        <p className="text-[var(--text-muted)]">Nessun membro trovato.</p>
      )}
    </div>
  )
}

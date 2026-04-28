import type { Metadata } from 'next'
import { getPeople, getPeopleTimeline } from '@/lib/getPeople'
import PeopleGrid from '@/components/person/PeopleGrid'
import MembershipTimeline from '@/components/person/MembershipTimeline'

export const metadata: Metadata = {
  title: 'Compagnia',
  description: 'I membri della compagnia teatrale Le Nuove Espressioni: attori, registi e tecnici.',
  openGraph: {
    title: 'Compagnia — Le Nuove Espressioni',
    description: 'I membri della compagnia teatrale Le Nuove Espressioni: attori, registi e tecnici.',
    type: 'website',
  },
}

function lastName(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.at(-1)?.toLowerCase() ?? ''
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AttoriPage({ searchParams }: Props) {
  const params = await searchParams

  if ('edespressionisimili' in params) {
    const raw = await getPeopleTimeline()
    const currentYear = new Date().getFullYear()

    type Entry = {
      id: string
      name: string
      role: string
      startYear: number
      endYear: number
      isActive: boolean
    }

    const people: Entry[] = (raw ?? []).flatMap((person) => {
      const perfDates = (person.performance_people ?? [])
        .map((pp) => pp.dates?.date)
        .filter((d): d is string => !!d)

      const startYear = person.joined_at
        ? new Date(person.joined_at).getFullYear()
        : perfDates.length > 0
          ? Math.min(...perfDates.map((d) => new Date(d).getFullYear()))
          : null

      const endYear = person.is_active
        ? currentYear
        : perfDates.length > 0
          ? Math.max(...perfDates.map((d) => new Date(d).getFullYear()))
          : null

      if (startYear == null || endYear == null) return []
      return [{ id: person.id, name: person.name, role: person.role, startYear, endYear, isActive: person.is_active ?? false }]
    })

    people.sort((a, b) => a.startYear - b.startYear || lastName(a.name).localeCompare(lastName(b.name), 'it'))

    const minYear = people.length > 0 ? Math.min(...people.map((p) => p.startYear)) : currentYear
    const maxYear = currentYear

    return (
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Le Nuove Espressioni</p>
        <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Storia della Compagnia</h1>
        <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
        <MembershipTimeline people={people} minYear={minYear} maxYear={maxYear} />
      </section>
    )
  }

  const people = await getPeople()
  const sorted = [...(people ?? [])].sort((a, b) =>
    lastName(a.name).localeCompare(lastName(b.name), 'it')
  )
  const active = sorted.filter((p) => p.is_active)
  const alumni = sorted.filter((p) => !p.is_active)

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Le Nuove Espressioni</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Compagnia</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      <PeopleGrid active={active} alumni={alumni} />
    </section>
  )
}

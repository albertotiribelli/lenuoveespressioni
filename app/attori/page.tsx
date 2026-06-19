import type { Metadata } from 'next'
import { getPeople, getPeopleTimeline } from '@/lib/getPeople'
import PeopleGrid from '@/components/person/PeopleGrid'
import MembershipTimeline from '@/components/person/MembershipTimeline'

export const metadata: Metadata = {
  title: 'Compagnia',
  description: 'I membri della compagnia teatrale Le Nuove Espressioni: attori, registi e tecnici.',
  alternates: { canonical: '/attori' },
  openGraph: {
    title: 'Compagnia — Le Nuove Espressioni',
    description: 'I membri della compagnia teatrale Le Nuove Espressioni: attori, registi e tecnici.',
    type: 'website',
    images: [{ url: '/logo.png' }],
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

    type Entry = {
      id: string
      name: string
      role: string
      isActive: boolean
      years: string[]
    }

    const people: Entry[] = (raw ?? [])
      .map((person) => {
        const years = [
          ...new Set(
            (person.performance_people ?? [])
              .map((pp) => pp.dates?.date?.slice(0, 4))
              .filter((y): y is string => !!y),
          ),
        ].sort((a, b) => a.localeCompare(b))

        return { id: person.id, name: person.name, role: person.role, isActive: person.is_active ?? false, years }
      })
      .filter((p) => p.years.length > 0)

    people.sort(
      (a, b) =>
        (a.years[0] ?? '').localeCompare(b.years[0] ?? '') ||
        lastName(a.name).localeCompare(lastName(b.name), 'it'),
    )

    const allYears = [...new Set(people.flatMap((p) => p.years))].sort((a, b) => a.localeCompare(b))

    return (
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Le Nuove Espressioni</p>
        <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Storia della Compagnia</h1>
        <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
        <MembershipTimeline people={people} allYears={allYears} />
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

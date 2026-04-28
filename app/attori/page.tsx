import type { Metadata } from 'next'
import { getPeople } from '@/lib/getPeople'
import PeopleGrid from '@/components/person/PeopleGrid'

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

export default async function AttoriPage() {
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

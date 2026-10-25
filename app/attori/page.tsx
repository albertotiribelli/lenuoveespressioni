import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig'
import { unstable_cache } from 'next/cache'
import { getPeople } from '@/lib/getPeople'
import { lastName } from '@/lib/membershipTimeline'
import PeopleGrid from '@/components/person/PeopleGrid'
import CompanyHistory from '@/components/person/CompanyHistory'

const getCachedPeople = unstable_cache(() => getPeople(), ['people-list'], { revalidate: 3600, tags: ['people'] })

export const metadata: Metadata = {
  title: 'Compagnia',
  description: 'I membri della compagnia teatrale Le Nuove Espressioni: attori, registi e tecnici.',
  alternates: { canonical: '/attori' },
  openGraph: {
    title: 'Compagnia — Le Nuove Espressioni',
    description: 'I membri della compagnia teatrale Le Nuove Espressioni: attori, registi e tecnici.',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
}

// Static page (ISR). The hidden company history is switched on client-side, see CompanyHistory.
export const revalidate = 3600

export default async function AttoriPage() {
  const people = await getCachedPeople()
  const sorted = [...(people ?? [])].sort((a, b) =>
    lastName(a.name).localeCompare(lastName(b.name), 'it')
  )
  const active = sorted.filter((p) => p.is_active)
  const alumni = sorted.filter((p) => !p.is_active)

  return (
    <CompanyHistory>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Le Nuove Espressioni</p>
        <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Compagnia</h1>
        <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
        <PeopleGrid active={active} alumni={alumni} />
      </section>
    </CompanyHistory>
  )
}

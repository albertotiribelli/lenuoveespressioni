import type { Metadata } from 'next'
import { getPlays } from '@/lib/getPlays'
import PlayGrid from '@/components/play/PlayGrid'

export const metadata: Metadata = {
  title: 'Spettacoli',
  description: 'Il repertorio della compagnia teatrale Le Nuove Espressioni: tutti gli spettacoli dal 2006 a oggi.',
  alternates: { canonical: '/spettacoli' },
  openGraph: {
    title: 'Spettacoli — Le Nuove Espressioni',
    description: 'Il repertorio della compagnia teatrale Le Nuove Espressioni: tutti gli spettacoli dal 2006 a oggi.',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
}

export default async function SpettacoliPage() {
  const plays = await getPlays()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Repertorio</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Spettacoli</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      <PlayGrid plays={plays ?? []} />
    </section>
  )
}

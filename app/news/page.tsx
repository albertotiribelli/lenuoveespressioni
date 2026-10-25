import type { Metadata } from 'next'
import { getNewsList } from '@/lib/getNews'
import NewsList from '@/components/news/NewsList'
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig'

export const revalidate = 3600

const DESCRIPTION = 'Le ultime notizie, i resoconti degli spettacoli e le uscite stampa di Le Nuove Espressioni.'

export const metadata: Metadata = {
  title: 'News',
  description: DESCRIPTION,
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'News — Le Nuove Espressioni',
    description: DESCRIPTION,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default async function NewsPage() {
  const items = await getNewsList()

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Dalla compagnia</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">News</h1>
      <div className="mb-12 h-px w-12 bg-[var(--accent)]" />
      <NewsList items={items} />
    </section>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getNewsBySlug, getNewsSlugs } from '@/lib/getNews'
import { formatDateItLong } from '@/lib/formatDate'
import { excerpt, paragraphs } from '@/lib/newsText'
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getNewsSlugs().catch(() => [])
  return slugs.map((n) => ({ slug: n.slug }))
}

interface Props {
  readonly params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsBySlug(slug).catch(() => null)
  if (!news) return {}

  const description = excerpt(news.body, 155)
  return {
    title: news.title,
    description,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: `${news.title} — Le Nuove Espressioni`,
      description,
      type: 'article',
      publishedTime: news.published_at,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = await getNewsBySlug(slug).catch(() => null)
  if (!news) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/news" className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--accent)]">
        ← Tutte le news
      </Link>
      <time dateTime={news.published_at} className="mt-8 block text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
        {formatDateItLong(news.published_at.slice(0, 10))}
      </time>
      <h1 className="mb-2 mt-4 font-serif text-4xl text-[var(--text)]">{news.title}</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      <div className="space-y-5 leading-relaxed text-[var(--text-muted)]">
        {paragraphs(news.body).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {news.plays && (
        <p className="mt-12 text-sm">
          <Link href={`/spettacoli/${news.plays.slug}`} className="text-[var(--accent)] hover:underline">
            Vai allo spettacolo: {news.plays.title} →
          </Link>
        </p>
      )}
    </article>
  )
}

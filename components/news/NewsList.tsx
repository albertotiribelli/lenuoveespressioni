import Link from 'next/link'
import { formatDateItLong } from '@/lib/formatDate'
import { excerpt } from '@/lib/newsText'

export interface NewsListItem {
  id: string
  slug: string
  title: string
  body: string
  published_at: string
  plays?: { slug: string; title: string } | null
}

export default function NewsList({ items }: { readonly items: NewsListItem[] }) {
  if (items.length === 0) {
    return <p className="text-[var(--text-muted)]">Nessuna notizia al momento.</p>
  }

  return (
    <ul className="space-y-10">
      {items.map((item) => (
        <li key={item.id} className="border-l-2 border-[var(--accent)] pl-5">
          <time dateTime={item.published_at} className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
            {formatDateItLong(item.published_at.slice(0, 10))}
          </time>
          <h2 className="mt-1 font-serif text-2xl text-[var(--text)]">
            <Link href={`/news/${item.slug}`} className="transition-colors hover:text-[var(--accent)]">
              {item.title}
            </Link>
          </h2>
          <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{excerpt(item.body)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <Link href={`/news/${item.slug}`} className="text-[var(--accent)] hover:underline">
              Leggi →
            </Link>
            {item.plays && (
              <Link href={`/spettacoli/${item.plays.slug}`} className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                {item.plays.title}
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

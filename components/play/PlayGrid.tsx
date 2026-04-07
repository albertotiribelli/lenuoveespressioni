import Link from 'next/link'
import Image from 'next/image'

interface PlaySummary {
  id: string
  slug: string
  title: string
  short_desc: string | null
  poster_url: string | null
}

interface PlayGridProps {
  plays: PlaySummary[]
}

export default function PlayGrid({ plays }: PlayGridProps) {
  if (plays.length === 0) {
    return (
      <p className="text-[var(--text-muted)]">Nessuno spettacolo disponibile.</p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plays.map((play) => (
        <Link
          key={play.id}
          href={`/spettacoli/${play.slug}`}
          className="group flex flex-col overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--card-bg)] transition-colors hover:border-[var(--accent)]"
        >
          {play.poster_url && (
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <Image
                src={play.poster_url}
                alt={`Locandina ${play.title}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 p-4">
            <h2 className="font-serif text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              {play.title}
            </h2>
            {play.short_desc && (
              <p className="text-sm text-[var(--text-muted)] line-clamp-3">{play.short_desc}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import type { UpcomingDate } from '@/types'
import { formatDateItLongWithWeekday } from '@/lib/formatDate'

interface PlayCardProps {
  readonly upcomingDate: UpcomingDate
  readonly variant?: 'near' | 'far' | 'past'
}

export default function PlayCard({ upcomingDate, variant = 'near' }: PlayCardProps) {
  const play = upcomingDate.productions?.plays
  if (!play) return null

  const formattedDate = formatDateItLongWithWeekday(upcomingDate.date)
  const isPast = variant === 'past'
  const isFar = variant === 'far'

  return (
    <Link
      href={`/spettacoli/${play.slug}`}
      className={`group flex gap-4 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--accent)] ${isPast ? 'opacity-50' : ''}`}
    >
      {play.poster_url && (
        <div className="relative h-32 w-20 flex-shrink-0 overflow-hidden">
          <Image
            src={play.poster_url}
            alt={`Locandina ${play.title}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}

      <div className="flex flex-col justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
            {play.title}
          </h3>
          {play.short_desc && (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
              {play.short_desc}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isFar && (
              <span className="rounded-sm border border-[var(--border)] px-2 py-0.5 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                In programma
              </span>
            )}
            {isPast && (
              <span className="rounded-sm border border-[var(--border)] px-2 py-0.5 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Conclusa
              </span>
            )}
            <div className={`text-xs uppercase tracking-wider ${isPast || isFar ? 'text-[var(--text-muted)]' : 'text-[var(--accent)]'}`}>
              <span>{formattedDate}</span>
              {upcomingDate.time && <span> — {upcomingDate.time.slice(0, 5)}</span>}
              {upcomingDate.theater_name && (
                <span className="text-[var(--text-muted)]">
                  {' '}· {upcomingDate.theater_name}
                  {upcomingDate.city && `, ${upcomingDate.city}`}
                </span>
              )}
            </div>
          </div>

          {!isPast && upcomingDate.tickets_url && (
            upcomingDate.tickets_url === 'coming-soon'
              ? (
                <span className="self-start text-xs italic text-[var(--text-muted)] opacity-60">
                  Biglietti disponibili a breve
                </span>
              )
              : (
                <a
                  href={upcomingDate.tickets_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="self-start rounded-sm border border-[var(--accent)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                >
                  Acquista biglietti →
                </a>
              )
          )}
        </div>
      </div>
    </Link>
  )
}

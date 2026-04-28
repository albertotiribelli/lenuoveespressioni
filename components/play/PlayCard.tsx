import Link from 'next/link'
import Image from 'next/image'
import type { UpcomingDate } from '@/types'
import { formatDateItLongWithWeekday } from '@/lib/formatDate'

interface PlayCardProps {
  upcomingDate: UpcomingDate
}

export default function PlayCard({ upcomingDate }: PlayCardProps) {
  const play = upcomingDate.productions?.plays
  if (!play) return null

  const formattedDate = formatDateItLongWithWeekday(upcomingDate.date)

  return (
    <Link
      href={`/spettacoli/${play.slug}`}
      className="group flex gap-4 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-colors hover:border-[var(--accent)]"
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
          <h3 className="font-serif text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            {play.title}
          </h3>
          {play.short_desc && (
            <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-2">
              {play.short_desc}
            </p>
          )}
        </div>

        <div className="text-xs text-[var(--accent)] uppercase tracking-wider">
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
    </Link>
  )
}

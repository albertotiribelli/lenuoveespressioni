'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HistoryEntry {
  readonly character_name: string | null
  readonly costume_url: string | null
  readonly role: string
  readonly notes: string | null
  readonly dates: {
    readonly date: string
    readonly theater_name: string
    readonly city: string | null
    readonly productions: {
      readonly season_year: string
      readonly plays: {
        readonly title: string
        readonly slug: string
      }
    }
  }
}

interface CompanyTimelineProps {
  readonly history: readonly HistoryEntry[]
  readonly onPlayHover?: (url: string | null) => void
}

export default function CompanyTimeline({ history, onPlayHover }: CompanyTimelineProps) {
  const [tappedIndex, setTappedIndex] = useState<number | null>(null)

  if (history.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Nessuna partecipazione registrata.</p>
    )
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.dates.date).getTime() - new Date(a.dates.date).getTime()
  )

  return (
    <ol className="space-y-4 border-l-2 border-[var(--border)] pl-6">
      {sorted.map((entry, i) => {
        const { plays, season_year } = entry.dates.productions
        const hasCostume = !!entry.costume_url
        const isTapped = tappedIndex === i
        const key = `${plays.slug}-${entry.dates.date}`

        return (
          <li key={key} className="relative">
            <span className="absolute -left-[1.625rem] top-1.5 h-3 w-3 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider">
              {season_year}
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-x-2">
              <Link
                href={`/spettacoli/${plays.slug}`}
                className="font-serif text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                onMouseEnter={() => hasCostume && onPlayHover?.(entry.costume_url)}
                onMouseLeave={() => onPlayHover?.(null)}
              >
                {plays.title}
              </Link>
              {entry.character_name && (
                <span className="text-sm text-[var(--text-muted)] italic">
                  {entry.role === 'actor' ? 'nei panni di' : 'come'} {entry.character_name}
                </span>
              )}
              {/* Mobile: tap icon to toggle costume photo inline */}
              {hasCostume && (
                <button
                  className="md:hidden text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  onClick={() => setTappedIndex(isTapped ? null : i)}
                  aria-label={isTapped ? 'Nascondi foto' : 'Vedi foto in costume'}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile: inline costume photo */}
            {hasCostume && isTapped && (
              <div className="mt-2 md:hidden">
                <Image
                  src={entry.costume_url ?? ''}
                  alt={`${plays.title} — foto in costume`}
                  width={110}
                  height={147}
                  className="rounded-sm object-cover"
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

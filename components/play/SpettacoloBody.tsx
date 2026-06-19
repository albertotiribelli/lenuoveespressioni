'use client'

import { useState, useEffect } from 'react'
import CreditsSection from './CreditsSection'
import ProductionHistory from './ProductionHistory'
import DatesList from './DatesList'
import YoutubeEmbed from '@/components/ui/YoutubeEmbed'
import type { PerformanceDate } from '@/types'

interface CreditEntry {
  character_name: string | null
  role: string
  people: { id: string; slug: string; name: string; photo_url: string | null }
  onlyDate: string | null
}

interface ProductionForHistory {
  id: string
  season_year: string
  notes: string | null
  dates: {
    id: string
    date: string
    time: string | null
    theater_name: string
    city: string | null
    gphotos_url?: string | null
    notes?: string | null
  }[]
}

interface SpettacoloBodyProps {
  readonly description: string | null
  readonly trailerUrl: string | null
  readonly youtubeUrl: string | null
  readonly playTitle: string
  readonly productions: readonly ProductionForHistory[]
  readonly castsPerProduction: readonly { season_year: string; cast: readonly CreditEntry[] }[]
  readonly upcomingDates: readonly PerformanceDate[]
}

export default function SpettacoloBody({
  description,
  trailerUrl,
  youtubeUrl,
  playTitle,
  productions,
  castsPerProduction,
  upcomingDates,
}: SpettacoloBodyProps) {
  const [clickedYear, setClickedYear] = useState(castsPerProduction[0]?.season_year ?? '')

  useEffect(() => {
    const year = new URLSearchParams(globalThis.location.search).get('year')
    if (year && castsPerProduction.some((p) => p.season_year === year)) {
      setClickedYear(year)
    }
  }, [castsPerProduction])
  const [hoveredYear, setHoveredYear] = useState<string | null>(null)

  const activeYear = hoveredYear ?? clickedYear
  const selectedCast = castsPerProduction.find((p) => p.season_year === activeYear)?.cast ?? []
  const multipleProductions = castsPerProduction.length > 1

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
      <div className="space-y-10">
        {description && (
          <section>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Sinossi</h2>
            <p className="leading-relaxed text-[var(--text-muted)]">{description}</p>
          </section>
        )}

        {(trailerUrl || youtubeUrl) && (
          <section>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Video</h2>
            {trailerUrl && <YoutubeEmbed url={trailerUrl} title={`Trailer — ${playTitle}`} />}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm text-[var(--accent)] hover:underline${trailerUrl ? ' mt-3 block' : ''}`}
              >
                Guarda lo spettacolo completo su YouTube →
              </a>
            )}
          </section>
        )}

        {productions.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Storico produzioni</h2>
            <ProductionHistory
              productions={productions as ProductionForHistory[]}
              activeYear={multipleProductions ? activeYear : undefined}
              onProductionHover={multipleProductions ? setHoveredYear : undefined}
            />
          </section>
        )}
      </div>

      <aside className="space-y-10">
        {upcomingDates.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Prossime date</h2>
            <DatesList dates={upcomingDates as PerformanceDate[]} />
          </section>
        )}

        {castsPerProduction.length > 0 && (
          <section>
            {multipleProductions && (
              <div className="mb-4 flex gap-2">
                {castsPerProduction.map(({ season_year }) => (
                  <button
                    key={season_year}
                    onClick={() => setClickedYear(season_year)}
                    onMouseEnter={() => setHoveredYear(season_year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className={`rounded-sm border px-3 py-1 text-xs transition-colors ${
                      activeYear === season_year
                        ? 'border-[var(--accent)] text-[var(--accent)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                    }`}
                  >
                    {season_year}
                  </button>
                ))}
              </div>
            )}
            <CreditsSection credits={selectedCast as CreditEntry[]} />
          </section>
        )}
      </aside>
    </div>
  )
}

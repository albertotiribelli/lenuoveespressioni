import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPlayBySlug } from '@/lib/getPlays'
import CastList from '@/components/play/CastList'
import DatesList from '@/components/play/DatesList'
import ProductionHistory from '@/components/play/ProductionHistory'
import type { PerformanceDate } from '@/types'

interface Props {
  readonly params: Promise<{ slug: string }>
}

export default async function SpettacoloPage({ params }: Props) {
  const { slug } = await params
  const play = await getPlayBySlug(slug).catch(() => null)
  if (!play) notFound()

  const allDates: PerformanceDate[] = play.productions
    ?.flatMap((p) => p.dates ?? [])
    .map((d) => ({
      id: d.id,
      production_id: null,
      date: d.date,
      time: d.time,
      theater_name: d.theater_name,
      city: d.city,
      gphotos_url: d.gphotos_url,
      notes: d.notes,
      created_at: null,
    })) ?? []

  const upcomingDates = allDates
    .filter((d) => d.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))

  const cast = (play.productions?.[0]?.dates?.[0]?.performance_people ?? [])
    .filter((pp) => pp.people != null)
    .map((pp) => ({
      character_name: pp.character_name,
      role: pp.role,
      people: pp.people!,
    }))

  return (
    <article className="mx-auto max-w-5xl px-6 py-20">
      {play.poster_url && (
        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-sm sm:h-96">
          <Image
            src={play.poster_url}
            alt={`Locandina ${play.title}`}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Spettacolo</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">{play.title}</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />

      <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {play.description && (
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Sinossi</h2>
              <p className="leading-relaxed text-[var(--text-muted)]">{play.description}</p>
            </section>
          )}

          {play.productions && play.productions.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Storico produzioni</h2>
              <ProductionHistory productions={play.productions.map((p) => ({
                id: p.id,
                season_year: p.season_year,
                notes: p.notes,
                dates: (p.dates ?? []).map((d) => ({
                  id: d.id,
                  date: d.date,
                  time: d.time,
                  theater_name: d.theater_name,
                  city: d.city,
                  gphotos_url: d.gphotos_url,
                })),
              }))} />
            </section>
          )}
        </div>

        <aside className="space-y-10">
          {upcomingDates.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Prossime date</h2>
              <DatesList dates={upcomingDates} />
            </section>
          )}

          {cast.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Cast</h2>
              <CastList cast={cast} />
            </section>
          )}

          {play.youtube_url && (
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Video</h2>
              <a
                href={play.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                Guarda su YouTube →
              </a>
            </section>
          )}

        </aside>
      </div>
    </article>
  )
}

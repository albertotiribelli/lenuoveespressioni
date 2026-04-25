import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPlayBySlug } from '@/lib/getPlays'
import SpettacoloBody from '@/components/play/SpettacoloBody'
import type { PerformanceDate } from '@/types'

interface Props {
  readonly params: Promise<{ slug: string }>
  readonly searchParams: Promise<{ year?: string }>
}

export default async function SpettacoloPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { year } = await searchParams
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

  const sortedProductions = [...(play.productions ?? [])].sort((a, b) =>
    b.season_year.localeCompare(a.season_year)
  )

  const castsPerProduction = sortedProductions.map((prod) => {
    const dates = prod.dates ?? []
    const totalDates = dates.length
    type PeopleType = NonNullable<typeof dates[0]['performance_people'][0]['people']>
    const castMap = new Map<string, {
      character_name: string | null
      role: string
      sort_order: number | null
      people: PeopleType
      datesSeen: string[]
    }>()

    for (const d of dates) {
      for (const pp of d.performance_people ?? []) {
        if (!pp.people) continue
        const key = pp.people.id
        if (castMap.has(key)) {
          castMap.get(key)?.datesSeen.push(d.date)
        } else {
          castMap.set(key, {
            character_name: pp.character_name,
            role: pp.role,
            sort_order: pp.sort_order,
            people: pp.people,
            datesSeen: [d.date],
          })
        }
      }
    }

    const cast = Array.from(castMap.values())
      .sort((a, b) => {
        if (a.sort_order == null && b.sort_order == null) return 0
        if (a.sort_order == null) return 1
        if (b.sort_order == null) return -1
        return a.sort_order - b.sort_order
      })
      .map((entry) => ({
        character_name: entry.character_name,
        role: entry.role,
        people: entry.people,
        onlyDate: entry.datesSeen.length === 1 && totalDates > 1 ? entry.datesSeen[0] : null,
      }))

    return { season_year: prod.season_year, cast }
  }).filter((p) => p.cast.length > 0)

  const productions = sortedProductions.map((p) => ({
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
      notes: d.notes,
    })),
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

      <SpettacoloBody
        description={play.description}
        trailerUrl={play.trailer_url}
        youtubeUrl={play.youtube_url}
        playTitle={play.title}
        productions={productions}
        castsPerProduction={castsPerProduction}
        upcomingDates={upcomingDates}
        initialYear={year}
      />
    </article>
  )
}

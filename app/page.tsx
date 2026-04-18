import { Suspense } from 'react'
import Link from 'next/link'
import UpcomingDatesSection from '@/components/ui/UpcomingDatesSection'
import YoutubeEmbed from '@/components/ui/YoutubeEmbed'
import { getPlays } from '@/lib/getPlays'

export default async function HomePage() {
  const plays = await getPlays()
  const trailers = (plays ?? []).filter((p) => p.trailer_url)

  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
          Compagnia Teatrale
        </p>
        <h1 className="font-serif text-5xl font-normal leading-tight text-[var(--text)] md:text-7xl">
          Le Nuove
          <br />
          Espressioni
        </h1>
        <p className="mt-6 max-w-md text-[var(--text-muted)]">
          Le luci si accenderanno, le musiche partiranno e le battute arriveranno...
          <br/>
          La magia del teatro prende vita!
        </p>
      </section>

      <div className="section-divider" />

      {/* Upcoming dates */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-16 text-[var(--text-muted)]">
            Caricamento date…
          </div>
        }
      >
        <UpcomingDatesSection />
      </Suspense>

      {/* Trailers */}
      {trailers.length > 0 && (
        <>
          <div className="section-divider" />
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-8 flex items-baseline justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[var(--text)]">Trailer</h2>
                <div className="mt-2 h-px w-12 bg-[var(--accent)]" />
              </div>
              <Link
                href="/media"
                className="text-xs text-[var(--accent)] hover:underline uppercase tracking-wider"
              >
                Tutti i video →
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {trailers.map((play) => (
                <div key={play.id}>
                  <YoutubeEmbed url={play.trailer_url} title={`Trailer — ${play.title}`} />
                  <Link
                    href={`/spettacoli/${play.slug}`}
                    className="mt-2 block font-serif text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {play.title}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}

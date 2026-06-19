import type { Metadata } from 'next'
import { getPlays } from '@/lib/getPlays'
import YoutubeEmbed from '@/components/ui/YoutubeEmbed'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Trailer e video degli spettacoli della compagnia teatrale Le Nuove Espressioni.',
  alternates: { canonical: '/media' },
  openGraph: {
    title: 'Media — Le Nuove Espressioni',
    description: 'Trailer e video degli spettacoli della compagnia teatrale Le Nuove Espressioni.',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
}

export default async function MediaPage() {
  const plays = await getPlays()
  const withTrailer = (plays ?? []).filter((p) => p.trailer_url)

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Rassegna</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Media</h1>
      <div className="mb-12 h-px w-12 bg-[var(--accent)]" />

      {withTrailer.length === 0 ? (
        <p className="text-[var(--text-muted)]">Nessun trailer disponibile al momento.</p>
      ) : (
        <div className="space-y-16">
          {withTrailer.map((play) => (
            <div key={play.id}>
              <div className="mb-3 flex items-baseline justify-between">
                <Link
                  href={`/spettacoli/${play.slug}`}
                  className="font-serif text-2xl text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                >
                  {play.title}
                </Link>
                {play.youtube_url && (
                  <a
                    href={play.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    Spettacolo completo →
                  </a>
                )}
              </div>
              <YoutubeEmbed url={play.trailer_url} title={`Trailer — ${play.title}`} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

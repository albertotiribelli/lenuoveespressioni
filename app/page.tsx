import { Suspense } from 'react'
import UpcomingDatesSection from '@/components/ui/UpcomingDatesSection'

export default function HomePage() {
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
          Teatro che cerca, che rischia, che lascia il segno.
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

      <div className="section-divider" />

      {/* Video reel placeholder */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 font-serif text-2xl text-[var(--text)]">Video</h2>
        <div className="mb-8 h-px w-12 bg-[var(--accent)]" />
        <div className="flex h-64 items-center justify-center rounded-sm border border-dashed border-[var(--border)] text-[var(--text-muted)]">
          <span className="text-sm">Video reel — in arrivo</span>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { getAllProductions } from '@/lib/getProductions'
import ArchiveTimeline from '@/components/ui/ArchiveTimeline'

export const metadata: Metadata = {
  title: 'Archivio',
  description: 'Lo storico delle produzioni di Le Nuove Espressioni dal 2006 a oggi: date, teatri e location.',
  openGraph: {
    title: 'Archivio — Le Nuove Espressioni',
    description: 'Lo storico delle produzioni di Le Nuove Espressioni dal 2006 a oggi: date, teatri e location.',
    type: 'website',
  },
}

export default async function ArchivioPage() {
  const productions = await getAllProductions()

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Storia</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Archivio</h1>
      <div className="mb-12 h-px w-12 bg-[var(--accent)]" />
      {productions && productions.length > 0 ? (
        <ArchiveTimeline productions={productions as Parameters<typeof ArchiveTimeline>[0]['productions']} />
      ) : (
        <p className="text-[var(--text-muted)]">Nessuna produzione in archivio.</p>
      )}
    </section>
  )
}

import { getUpcomingDates } from '@/lib/getUpcomingDates'
import PlayCard from '@/components/play/PlayCard'
import type { UpcomingDate } from '@/types'

export default async function UpcomingDatesSection() {
  let dates: UpcomingDate[] = []

  try {
    const result = await getUpcomingDates()
    dates = (result ?? []) as UpcomingDate[]
  } catch (err) {
    console.error('Errore nel caricamento delle date:', err)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-2 font-serif text-2xl text-[var(--text)]">
        Prossime date
      </h2>
      <div className="mb-8 h-px w-12 bg-[var(--accent)]" />

      {dates.length === 0 ? (
        <p className="text-[var(--text-muted)]">
          Nessuna data in programma al momento. Torna presto.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {dates.map((date) => (
            <PlayCard key={date.id} upcomingDate={date} />
          ))}
        </div>
      )}
    </section>
  )
}

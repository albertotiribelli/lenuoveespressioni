import { getUpcomingDates } from '@/lib/getUpcomingDates'
import PlayCard from '@/components/play/PlayCard'
import type { UpcomingDate } from '@/types'

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default async function UpcomingDatesSection() {
  let dates: UpcomingDate[] = []

  try {
    const result = await getUpcomingDates()
    dates = result ?? []
  } catch (err) {
    console.error('Errore nel caricamento delle date:', err)
  }

  const today = new Date().toISOString().slice(0, 10)
  const nearCutoff = addDays(60)

  const past = dates.filter((d) => d.date < today)
  const near = dates.filter((d) => d.date >= today && d.date <= nearCutoff)
  const far = dates.filter((d) => d.date > nearCutoff)

  const hasAny = dates.length > 0

  let mainTitle = 'Recentemente in scena'
  if (near.length > 0) mainTitle = 'Prossime date'
  else if (far.length > 0) mainTitle = 'In programma'

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-2 font-serif text-2xl text-[var(--text)]">{mainTitle}</h2>
      <div className="mb-8 h-px w-12 bg-[var(--accent)]" />

      {hasAny ? (
        <div className="flex flex-col gap-10">
          {/* Near future */}
          {near.length > 0 && (
            <div className="flex flex-col gap-4">
              {near.map((date) => (
                <PlayCard key={date.id} upcomingDate={date} variant="near" />
              ))}
            </div>
          )}

          {/* Far future */}
          {far.length > 0 && (
            <div>
              {near.length > 0 && (
                <>
                  <h3 className="mb-2 text-sm font-normal text-[var(--text-muted)] uppercase tracking-[0.2em]">In programma</h3>
                  <div className="mb-4 h-px w-8 bg-[var(--border)]" />
                </>
              )}
              <div className="flex flex-col gap-4">
                {far.map((date) => (
                  <PlayCard key={date.id} upcomingDate={date} variant="far" />
                ))}
              </div>
            </div>
          )}

          {/* Recent past */}
          {past.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-normal text-[var(--text-muted)] uppercase tracking-[0.2em]">Recentemente in scena</h3>
              <div className="mb-4 h-px w-8 bg-[var(--border)]" />
              <div className="flex flex-col gap-4">
                {[...past].reverse().map((date) => (
                  <PlayCard key={date.id} upcomingDate={date} variant="past" />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[var(--text-muted)]">Nessuna data in programma al momento. Torna presto.</p>
      )}
    </section>
  )
}

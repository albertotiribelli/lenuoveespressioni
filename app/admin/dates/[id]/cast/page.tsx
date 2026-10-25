import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import { formatDateItLong } from '@/lib/formatDate'

const ROW = 'flex min-h-11 flex-col gap-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]'

export default async function DateCast({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: date } = await supabase
    .from('dates')
    .select('id, date, theater_name, productions(plays(title))')
    .eq('id', id)
    .maybeSingle()
  if (!date) notFound()

  const { data, error } = await supabase
    .from('performance_people')
    .select('id, role, character_name, sort_order, people(name)')
    .eq('date_id', id)
  if (error) throw error

  const entries = [...(data ?? [])].sort(
    (a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)
  )

  return (
    <section className="flex flex-col gap-4">
      <Link href={`/admin/dates/${date.id}`} className="min-h-11 content-center text-sm underline">
        ← {date.theater_name}
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-2xl">Cast e crediti</h1>
        <Link href={`/admin/dates/${date.id}/cast/new`} className="flex min-h-11 items-center rounded-sm border border-[var(--accent)] px-4 text-[var(--accent)]">
          + Nuova
        </Link>
      </div>
      <p className="text-sm opacity-70">
        {formatDateItLong(date.date)} · {date.productions?.plays?.title ?? 'Senza spettacolo'}
      </p>
      <ul className="flex flex-col gap-2">
        {entries.map((e) => (
          <li key={e.id}>
            <Link href={`/admin/dates/${date.id}/cast/${e.id}`} className={ROW}>
              <span className="font-bold">{e.people?.name ?? 'Persona sconosciuta'}</span>
              <span className="text-sm opacity-70">
                {e.role}
                {e.character_name ? ` · ${e.character_name}` : ''}
              </span>
            </Link>
          </li>
        ))}
        {entries.length === 0 && <li className="text-sm opacity-70">Nessuna voce.</li>}
      </ul>
    </section>
  )
}

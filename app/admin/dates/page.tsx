import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import { formatDateItLong } from '@/lib/formatDate'

const ROW = 'flex min-h-11 flex-col gap-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]'

export default async function AdminDates() {
  const { supabase } = await requireAdminPage()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('dates')
    .select('id, date, theater_name, city, tickets_url, productions(plays(title))')
    .order('date', { ascending: false })
  if (error) throw error

  const dates = data ?? []
  const upcoming = dates.filter((d) => d.date >= today).reverse()
  const past = dates.filter((d) => d.date < today)

  const renderList = (list: typeof dates, flagMissingTickets: boolean) => (
    <ul className="flex flex-col gap-2">
      {list.map((d) => (
        <li key={d.id}>
          <Link href={`/admin/dates/${d.id}`} className={ROW}>
            <span className="font-bold">
              {formatDateItLong(d.date)} · {d.productions?.plays?.title ?? 'Senza spettacolo'}
            </span>
            <span className="text-sm opacity-70">
              {d.theater_name}
              {d.city ? `, ${d.city}` : ''}
            </span>
            {flagMissingTickets && !d.tickets_url && <span className="text-xs text-amber-400">Manca il link biglietti</span>}
          </Link>
        </li>
      ))}
      {list.length === 0 && <li className="text-sm opacity-70">Nessuna data.</li>}
    </ul>
  )

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl">Date</h1>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">Prossime</h2>
        {renderList(upcoming, true)}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">Passate</h2>
        {renderList(past, false)}
      </div>
    </section>
  )
}

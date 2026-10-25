import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import { formatDateItLong } from '@/lib/formatDate'
import ProductionForm from '@/components/admin/ProductionForm'

const ROW = 'flex min-h-11 flex-col gap-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]'

export default async function EditProduction({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: production } = await supabase
    .from('productions')
    .select('id, season_year, notes, plays(id, title), dates(id, date, theater_name, city)')
    .eq('id', id)
    .maybeSingle()
  if (!production) notFound()

  const dates = [...(production.dates ?? [])].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="flex flex-col gap-4">
      {production.plays ? (
        <Link href={`/admin/plays/${production.plays.id}`} className="min-h-11 content-center text-sm underline">
          ← {production.plays.title}
        </Link>
      ) : (
        <Link href="/admin/plays" className="min-h-11 content-center text-sm underline">
          ← Spettacoli
        </Link>
      )}
      <h1 className="font-serif text-2xl">
        {production.plays?.title ?? 'Produzione'} · {production.season_year}
      </h1>
      <ProductionForm production={production} />
      <div className="flex flex-col gap-2 pb-24">
        <h2 className="font-bold">Date</h2>
        <ul className="flex flex-col gap-2">
          {dates.map((d) => (
            <li key={d.id}>
              <Link href={`/admin/dates/${d.id}`} className={ROW}>
                <span className="font-bold">{formatDateItLong(d.date)}</span>
                <span className="text-sm opacity-70">
                  {d.theater_name}
                  {d.city ? `, ${d.city}` : ''}
                </span>
              </Link>
            </li>
          ))}
          {dates.length === 0 && <li className="text-sm opacity-70">Nessuna data.</li>}
        </ul>
      </div>
    </section>
  )
}

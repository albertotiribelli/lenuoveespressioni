import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import DateForm from '@/components/admin/DateForm'

export default async function EditDate({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: date } = await supabase
    .from('dates')
    .select('id, date, time, theater_name, city, notes, tickets_url, gphotos_url, productions(id, season_year, plays(title))')
    .eq('id', id)
    .maybeSingle()
  if (!date) notFound()

  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/dates" className="min-h-11 content-center text-sm underline">
        ← Date
      </Link>
      <h1 className="font-serif text-2xl">{date.theater_name}</h1>
      {date.productions && (
        <Link href={`/admin/productions/${date.productions.id}`} className="min-h-11 content-center text-sm underline">
          {date.productions.plays?.title ?? 'Produzione'} · {date.productions.season_year}
        </Link>
      )}
      <Link
        href={`/admin/dates/${date.id}/cast`}
        className="flex min-h-11 items-center rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]"
      >
        Cast e crediti →
      </Link>
      <DateForm date={date} />
    </section>
  )
}

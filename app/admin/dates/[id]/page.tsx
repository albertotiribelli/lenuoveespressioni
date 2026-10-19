import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import DateForm from '@/components/admin/DateForm'

export default async function EditDate({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: date } = await supabase
    .from('dates')
    .select('id, date, time, theater_name, city, notes, tickets_url, gphotos_url')
    .eq('id', id)
    .maybeSingle()
  if (!date) notFound()

  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/dates" className="min-h-11 content-center text-sm underline">
        ← Date
      </Link>
      <h1 className="font-serif text-2xl">{date.theater_name}</h1>
      <DateForm date={date} />
    </section>
  )
}

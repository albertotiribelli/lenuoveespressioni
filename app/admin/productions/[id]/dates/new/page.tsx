import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import DateForm from '@/components/admin/DateForm'

export default async function NewDate({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: production } = await supabase
    .from('productions')
    .select('id, season_year, plays(title)')
    .eq('id', id)
    .maybeSingle()
  if (!production) notFound()

  return (
    <section className="flex flex-col gap-4">
      <Link href={`/admin/productions/${production.id}`} className="min-h-11 content-center text-sm underline">
        ← {production.plays?.title ?? 'Produzione'} · {production.season_year}
      </Link>
      <h1 className="font-serif text-2xl">Nuova data</h1>
      <DateForm productionId={production.id} />
    </section>
  )
}

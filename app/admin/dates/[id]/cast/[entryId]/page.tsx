import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import PerformancePersonForm from '@/components/admin/PerformancePersonForm'

export default async function EditCastEntry({ params }: { params: Promise<{ id: string; entryId: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id, entryId } = await params

  const { data: entry } = await supabase
    .from('performance_people')
    .select('id, role, character_name, sort_order, costume_url, notes, people(name)')
    .eq('id', entryId)
    .eq('date_id', id)
    .maybeSingle()
  if (!entry) notFound()

  return (
    <section className="flex flex-col gap-4">
      <Link href={`/admin/dates/${id}/cast`} className="min-h-11 content-center text-sm underline">
        ← Cast e crediti
      </Link>
      <h1 className="font-serif text-2xl">{entry.people?.name ?? 'Persona sconosciuta'}</h1>
      <PerformancePersonForm entry={entry} />
    </section>
  )
}

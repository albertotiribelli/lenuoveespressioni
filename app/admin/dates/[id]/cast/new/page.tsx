import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import PerformancePersonForm from '@/components/admin/PerformancePersonForm'

export default async function NewCastEntry({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: date } = await supabase.from('dates').select('id, theater_name').eq('id', id).maybeSingle()
  if (!date) notFound()

  const { data: people, error } = await supabase.from('people').select('id, name').order('name', { ascending: true })
  if (error) throw error

  return (
    <section className="flex flex-col gap-4">
      <Link href={`/admin/dates/${date.id}/cast`} className="min-h-11 content-center text-sm underline">
        ← Cast e crediti
      </Link>
      <h1 className="font-serif text-2xl">Nuova voce di cast</h1>
      <PerformancePersonForm dateId={date.id} people={people ?? []} />
    </section>
  )
}

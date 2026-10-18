import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import PersonForm from '@/components/admin/PersonForm'

export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: person } = await supabase
    .from('people')
    .select('id, name, role, bio, photo_url, joined_at, is_active')
    .eq('id', id)
    .maybeSingle()
  if (!person) notFound()

  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/people" className="min-h-11 content-center text-sm underline">
        ← Persone
      </Link>
      <h1 className="font-serif text-2xl">{person.name}</h1>
      <PersonForm person={person} />
    </section>
  )
}

import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import PersonForm from '@/components/admin/PersonForm'

export default async function NewPerson() {
  await requireAdminPage()
  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/people" className="min-h-11 content-center text-sm underline">
        ← Persone
      </Link>
      <h1 className="font-serif text-2xl">Nuova persona</h1>
      <PersonForm />
    </section>
  )
}

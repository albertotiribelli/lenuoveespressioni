import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import PlayForm from '@/components/admin/PlayForm'

export default async function NewPlay() {
  await requireAdminPage()
  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/plays" className="min-h-11 content-center text-sm underline">
        ← Spettacoli
      </Link>
      <h1 className="font-serif text-2xl">Nuovo spettacolo</h1>
      <PlayForm />
    </section>
  )
}

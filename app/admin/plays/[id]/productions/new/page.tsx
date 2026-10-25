import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import ProductionForm from '@/components/admin/ProductionForm'

export default async function NewProduction({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: play } = await supabase.from('plays').select('id, title').eq('id', id).maybeSingle()
  if (!play) notFound()

  return (
    <section className="flex flex-col gap-4">
      <Link href={`/admin/plays/${play.id}`} className="min-h-11 content-center text-sm underline">
        ← {play.title}
      </Link>
      <h1 className="font-serif text-2xl">Nuova produzione</h1>
      <ProductionForm playId={play.id} />
    </section>
  )
}

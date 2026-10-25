import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import PlayForm from '@/components/admin/PlayForm'

const ROW = 'flex min-h-11 items-center justify-between rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]'

export default async function EditPlay({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdminPage()
  const { id } = await params

  const { data: play } = await supabase
    .from('plays')
    .select('id, title, short_desc, description, poster_url, trailer_url, youtube_url, productions(id, season_year, dates(id))')
    .eq('id', id)
    .maybeSingle()
  if (!play) notFound()

  const productions = [...(play.productions ?? [])].sort((a, b) => b.season_year.localeCompare(a.season_year))

  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/plays" className="min-h-11 content-center text-sm underline">
        ← Spettacoli
      </Link>
      <h1 className="font-serif text-2xl">{play.title}</h1>
      <PlayForm play={play} />
      <div className="flex flex-col gap-2 pb-24">
        <h2 className="font-bold">Produzioni</h2>
        <ul className="flex flex-col gap-2">
          {productions.map((pr) => (
            <li key={pr.id}>
              <Link href={`/admin/productions/${pr.id}`} className={ROW}>
                <span>{pr.season_year}</span>
                <span className="text-sm opacity-70">{pr.dates?.length ?? 0} date</span>
              </Link>
            </li>
          ))}
          {productions.length === 0 && <li className="text-sm opacity-70">Nessuna produzione.</li>}
        </ul>
      </div>
    </section>
  )
}

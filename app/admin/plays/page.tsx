import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'

const ROW = 'flex min-h-11 flex-col gap-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]'

export default async function AdminPlays() {
  const { supabase } = await requireAdminPage()

  const { data: plays, error } = await supabase
    .from('plays')
    .select('id, title, description, poster_url, productions(season_year)')
    .order('title', { ascending: true })
  if (error) throw error

  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl">Spettacoli</h1>
      <ul className="flex flex-col gap-2">
        {(plays ?? []).map((p) => {
          const missing = [!p.description && 'descrizione', !p.poster_url && 'locandina'].filter(Boolean).join(', ')
          const years = (p.productions ?? []).map((pr) => pr.season_year).sort().join(', ')
          return (
            <li key={p.id}>
              <Link href={`/admin/plays/${p.id}`} className={ROW}>
                <span className="font-bold">{p.title}</span>
                {years && <span className="text-sm opacity-70">{years}</span>}
                {missing && <span className="text-xs text-amber-400">Mancano: {missing}</span>}
              </Link>
            </li>
          )
        })}
        {plays?.length === 0 && <li className="text-sm opacity-70">Nessuno spettacolo.</li>}
      </ul>
    </section>
  )
}

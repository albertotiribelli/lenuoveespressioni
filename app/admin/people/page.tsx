import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'

const ROW = 'flex min-h-11 flex-col gap-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3 hover:border-[var(--accent)]'

export default async function AdminPeople({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { supabase } = await requireAdminPage()
  const { q = '' } = await searchParams
  const query = q.trim()

  let req = supabase.from('people').select('id, name, role, bio, photo_url, is_active').order('name', { ascending: true })
  if (query) req = req.ilike('name', `%${query.replace(/[%_]/g, '')}%`)
  const { data: people, error } = await req
  if (error) throw error

  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl">Persone</h1>
      <form className="flex gap-2" role="search">
        <input
          name="q"
          defaultValue={query}
          placeholder="Cerca per nome"
          className="min-h-11 flex-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] px-3"
        />
        <button type="submit" className="min-h-11 rounded-sm border border-[var(--border)] px-4">
          Cerca
        </button>
      </form>
      <ul className="flex flex-col gap-2">
        {(people ?? []).map((p) => {
          const missing = [!p.bio && 'bio', !p.photo_url && 'foto'].filter(Boolean).join(', ')
          return (
            <li key={p.id}>
              <Link href={`/admin/people/${p.id}`} className={ROW}>
                <span className="font-bold">
                  {p.name} {!p.is_active && <span className="text-xs font-normal opacity-60">(ex)</span>}
                </span>
                {missing && <span className="text-xs text-amber-400">Mancano: {missing}</span>}
              </Link>
            </li>
          )
        })}
        {people?.length === 0 && <li className="text-sm opacity-70">Nessun risultato.</li>}
      </ul>
    </section>
  )
}

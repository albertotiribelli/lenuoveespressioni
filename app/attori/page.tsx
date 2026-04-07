import { getActivePeople } from '@/lib/getPeople'
import PersonCard from '@/components/person/PersonCard'

export default async function AttoriPage() {
  const people = await getActivePeople()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">La compagnia</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Attori</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      {people && people.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--text-muted)]">Nessun profilo disponibile.</p>
      )}
    </section>
  )
}

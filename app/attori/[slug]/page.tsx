import { notFound } from 'next/navigation'
import { getPersonBySlug } from '@/lib/getPeople'
import AttoreLayout from '@/components/person/AttoreLayout'

const ROLE_LABELS: Record<string, string> = {
  actor: 'Attore',
  director: 'Regista',
  technician: 'Tecnico',
  other: 'Collaboratore',
}

interface Props {
  readonly params: Promise<{ slug: string }>
}

export default async function AttorePage({ params }: Props) {
  const { slug } = await params
  const person = await getPersonBySlug(slug).catch(() => null)
  if (!person) notFound()

  // Deduplicate by play+season: one timeline entry per production, preferring rows with costume_url
  const productionMap = new Map<string, {
    character_name: string | null
    costume_url: string | null
    role: string
    notes: string | null
    dates: {
      date: string
      theater_name: string
      city: string | null
      productions: { season_year: string; plays: { title: string; slug: string } }
    }
  }>()

  for (const pp of (person.performance_people ?? [])) {
    if (pp.dates?.productions?.plays == null) continue
    const key = `${pp.dates.productions.plays.slug}-${pp.dates.productions.season_year}`
    const existing = productionMap.get(key)
    if (!existing || (!existing.costume_url && pp.costume_url)) {
      productionMap.set(key, {
        character_name: pp.character_name,
        costume_url: pp.costume_url,
        role: pp.role,
        notes: pp.notes,
        dates: {
          date: pp.dates.date,
          theater_name: pp.dates.theater_name,
          city: pp.dates.city,
          productions: {
            season_year: pp.dates.productions.season_year,
            plays: {
              title: pp.dates.productions.plays.title,
              slug: pp.dates.productions.plays.slug,
            },
          },
        },
      })
    }
  }

  const history = [...productionMap.values()]

  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <AttoreLayout
        person={{
          name: person.name,
          photo_url: person.photo_url,
          bio: person.bio,
          role: person.role,
        }}
        roleLabel={ROLE_LABELS[person.role] ?? person.role}
        history={history}
      />
    </article>
  )
}

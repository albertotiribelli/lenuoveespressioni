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

  const history = (person.performance_people ?? [])
    .filter((pp) => pp.dates?.productions?.plays != null)
    .map((pp) => ({
      character_name: pp.character_name,
      costume_url: pp.costume_url,
      role: pp.role,
      notes: pp.notes,
      dates: {
        date: pp.dates!.date,
        theater_name: pp.dates!.theater_name,
        city: pp.dates!.city,
        productions: {
          season_year: pp.dates!.productions!.season_year,
          plays: {
            title: pp.dates!.productions!.plays!.title,
            slug: pp.dates!.productions!.plays!.slug,
          },
        },
      },
    }))

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

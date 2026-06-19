import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPersonBySlug, getPersonMeta, getPersonSlugs } from '@/lib/getPeople'
import AttoreLayout from '@/components/person/AttoreLayout'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getPersonSlugs().catch(() => [])
  return (slugs ?? []).map((p) => ({ slug: p.slug }))
}

const ROLE_LABELS: Record<string, string> = {
  actor: 'Attore',
  director: 'Regista',
  technician: 'Tecnico',
  other: 'Collaboratore',
}

interface Props {
  readonly params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const person = await getPersonMeta(slug).catch(() => null)
  if (!person) return {}

  const roleLabel = ROLE_LABELS[person.role] ?? person.role
  const description = person.bio
    ?? `${person.name}, ${roleLabel} della compagnia teatrale Le Nuove Espressioni.`
  const truncated = description.length > 155 ? description.slice(0, 152) + '…' : description

  return {
    title: person.name,
    description: truncated,
    alternates: { canonical: `/attori/${slug}` },
    openGraph: {
      title: `${person.name} — Le Nuove Espressioni`,
      description: truncated,
      type: 'website',
      ...(person.photo_url && { images: [{ url: person.photo_url }] }),
    },
  }
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

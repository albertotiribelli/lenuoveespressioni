import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPersonBySlug } from '@/lib/getPeople'
import CompanyTimeline from '@/components/person/CompanyTimeline'

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
      <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative h-48 w-36 flex-shrink-0 overflow-hidden rounded-sm bg-[var(--border)]">
          {person.photo_url ? (
            <Image
              src={person.photo_url}
              alt={person.name}
              fill
              className="object-cover object-top"
              priority
              sizes="144px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
            {ROLE_LABELS[person.role] ?? person.role}
          </p>
          <h1 className="mb-4 font-serif text-4xl text-[var(--text)]">{person.name}</h1>
          {person.bio && (
            <p className="leading-relaxed text-[var(--text-muted)]">{person.bio}</p>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--border)]" />

      <section className="mt-10">
        <h2 className="mb-6 text-xs uppercase tracking-widest text-[var(--accent)]">
          Storia in compagnia
        </h2>
        <CompanyTimeline history={history} />
      </section>
    </article>
  )
}

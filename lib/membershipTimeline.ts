// lib/membershipTimeline.ts — shapes the people + performances query into the data of the membership timeline

export function lastName(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.at(-1)?.toLowerCase() ?? ''
}

export interface TimelineEntry {
  id: string
  name: string
  role: string
  isActive: boolean
  years: string[]
}

interface RawPerson {
  id: string
  name: string
  role: string
  is_active: boolean | null
  performance_people: { dates: { date: string | null } | null }[] | null
}

export function buildMembershipTimeline(raw: readonly RawPerson[] | null) {
  const people: TimelineEntry[] = (raw ?? [])
    .map((person) => {
      const years = [
        ...new Set(
          (person.performance_people ?? [])
            .map((pp) => pp.dates?.date?.slice(0, 4))
            .filter((y): y is string => !!y),
        ),
      ].sort((a, b) => a.localeCompare(b))

      return { id: person.id, name: person.name, role: person.role, isActive: person.is_active ?? false, years }
    })
    .filter((p) => p.years.length > 0)

  people.sort(
    (a, b) =>
      (a.years[0] ?? '').localeCompare(b.years[0] ?? '') ||
      lastName(a.name).localeCompare(lastName(b.name), 'it'),
  )

  const allYears = [...new Set(people.flatMap((p) => p.years))].sort((a, b) => a.localeCompare(b))
  return { people, allYears }
}

import { Fragment } from 'react'

const ROLE_COLORS: Record<string, string> = {
  actor: '#E94560',
  director: '#7EB8D4',
  technician: '#7ED4B4',
  other: '#7C8DB5',
}

const ROLE_LABELS: Record<string, string> = {
  actor: 'Attore',
  director: 'Regista',
  technician: 'Tecnico',
  other: 'Collaboratore',
}

export interface TimelinePerson {
  id: string
  name: string
  role: string
  isActive: boolean
  years: string[]
}

interface Props {
  readonly people: TimelinePerson[]
  readonly allYears: string[]
}

const COL_W = 48

function computeSegments(yearsSet: Set<string>, allYears: string[]) {
  const segs: Array<{ participated: boolean; count: number; startYear: string }> = []
  for (const year of allYears) {
    const participated = yearsSet.has(year)
    const last = segs.at(-1)
    if (last?.participated === participated) {
      last.count++
    } else {
      segs.push({ participated, count: 1, startYear: year })
    }
  }
  return segs
}

export default function MembershipTimeline({ people, allYears }: Props) {
  const rolesPresent = [...new Set(people.map((p) => p.role))]

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${160 + allYears.length * COL_W}px` }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `160px repeat(${allYears.length}, ${COL_W}px)`,
          }}
        >
          {/* Header: year labels */}
          <div />
          {allYears.map((year) => (
            <div key={year} className="pb-3 text-center text-xs text-[var(--text-muted)]">
              {year}
            </div>
          ))}

          {/* Separator */}
          <div
            style={{ gridColumn: `1 / span ${allYears.length + 1}` }}
            className="mb-3 h-px bg-[var(--border)]"
          />

          {/* Person rows */}
          {people.map((person) => {
            const yearsSet = new Set(person.years)
            const color = ROLE_COLORS[person.role] ?? ROLE_COLORS.other
            const segments = computeSegments(yearsSet, allYears)

            return (
              <Fragment key={person.id}>
                {/* Name */}
                <div
                  className="flex items-center justify-end pr-4 text-xs text-[var(--text)]"
                  style={{ height: '22px' }}
                >
                  {person.name}
                </div>

                {/* Merged segments */}
                {segments.map((seg) => (
                  <div
                    key={seg.startYear}
                    style={{ gridColumn: `span ${seg.count}`, height: '22px', display: 'flex', alignItems: 'center' }}
                  >
                    {seg.participated && (
                      <div
                        style={{
                          width: '100%',
                          height: '12px',
                          backgroundColor: color,
                          opacity: person.isActive ? 0.9 : 0.4,
                          borderRadius: '3px',
                        }}
                      />
                    )}
                  </div>
                ))}
              </Fragment>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--border)] pt-6">
          {rolesPresent.map((role) => (
            <div key={role} className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: ROLE_COLORS[role] ?? ROLE_COLORS.other,
                  width: '20px',
                  height: '8px',
                  borderRadius: '2px',
                }}
              />
              <span className="text-xs text-[var(--text-muted)]">{ROLE_LABELS[role] ?? role}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span style={{ opacity: 0.9 }}>▬ attivo</span>
            <span style={{ opacity: 0.4 }}>▬ ex membro</span>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  startYear: number
  endYear: number
  isActive: boolean
}

interface Props {
  people: TimelinePerson[]
  minYear: number
  maxYear: number
}

export default function MembershipTimeline({ people, minYear, maxYear }: Props) {
  const span = maxYear - minYear + 1

  function pct(year: number) {
    return ((year - minYear) / span) * 100
  }

  const tickYears = Array.from({ length: span }, (_, i) => minYear + i).filter(
    (y) => y === minYear || y === maxYear || y % 2 === 0,
  )

  const rolesPresent = [...new Set(people.map((p) => p.role))]

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '560px' }}>
        {/* Year labels */}
        <div className="relative mb-1" style={{ marginLeft: '160px', height: '20px' }}>
          {tickYears.map((year) => (
            <span
              key={year}
              style={{ left: `${pct(year)}%` }}
              className="absolute -translate-x-1/2 text-xs text-[var(--text-muted)]"
            >
              {year}
            </span>
          ))}
        </div>

        {/* Tick marks */}
        <div className="relative mb-4" style={{ marginLeft: '160px', height: '8px' }}>
          {tickYears.map((year) => (
            <div
              key={year}
              style={{ left: `${pct(year)}%` }}
              className="absolute top-0 h-2 w-px bg-[var(--border)]"
            />
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {people.map((person) => {
            const color = ROLE_COLORS[person.role] ?? ROLE_COLORS.other
            const barLeft = pct(person.startYear)
            const barRight = pct(person.endYear + 1)
            const barWidth = barRight - barLeft
            const label = `${person.startYear} – ${person.isActive ? 'presente' : person.endYear}`

            return (
              <div key={person.id} className="flex items-center">
                <div
                  className="flex-shrink-0 pr-4 text-right text-xs text-[var(--text)]"
                  style={{ width: '160px' }}
                >
                  {person.name}
                </div>
                <div className="relative flex-1" style={{ height: '18px' }}>
                  {/* Grid lines */}
                  {tickYears.map((year) => (
                    <div
                      key={year}
                      style={{ left: `${pct(year)}%` }}
                      className="absolute inset-y-0 w-px bg-[var(--border)] opacity-30"
                    />
                  ))}
                  {/* Bar */}
                  <div
                    title={label}
                    style={{
                      position: 'absolute',
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      top: '3px',
                      bottom: '3px',
                      backgroundColor: color,
                      opacity: person.isActive ? 0.9 : 0.35,
                      borderRadius: '2px',
                    }}
                  />
                  {/* Present-day arrow for active members */}
                  {person.isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${barRight}%`,
                        top: '3px',
                        bottom: '3px',
                        width: 0,
                        height: 0,
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderLeft: `6px solid ${color}`,
                        opacity: 0.9,
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--border)] pt-6">
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
            <span className="opacity-90">▬ attivo</span>
            <span className="opacity-35">▬ ex membro</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { buildMembershipTimeline, lastName } from '@/lib/membershipTimeline'

const person = (id: string, name: string, dates: (string | null)[], is_active: boolean | null = true) => ({
  id,
  name,
  role: 'actor',
  is_active,
  performance_people: dates.map((date) => ({ dates: date ? { date } : null })),
})

describe('lastName', () => {
  it('returns the lowercase last word', () => {
    expect(lastName('  Mario  Rossi ')).toBe('rossi')
    expect(lastName('Cher')).toBe('cher')
  })
})

describe('buildMembershipTimeline', () => {
  it('lists the distinct, sorted years of each person and drops people without performances', () => {
    const { people } = buildMembershipTimeline([
      person('1', 'Mario Rossi', ['2019-05-01', '2016-03-02', '2019-11-09']),
      person('2', 'Anna Bianchi', []),
      person('3', 'Luca Verdi', [null]),
    ])
    expect(people).toEqual([{ id: '1', name: 'Mario Rossi', role: 'actor', isActive: true, years: ['2016', '2019'] }])
  })

  it('orders by first year, then by last name, and collects all years', () => {
    const { people, allYears } = buildMembershipTimeline([
      person('1', 'Zeta Verdi', ['2018-01-01']),
      person('2', 'Anna Bianchi', ['2018-02-01', '2020-01-01']),
      person('3', 'Carlo Alfa', ['2015-01-01']),
    ])
    expect(people.map((p) => p.id)).toEqual(['3', '2', '1'])
    expect(allYears).toEqual(['2015', '2018', '2020'])
  })

  it('treats a null is_active as inactive and handles null input', () => {
    expect(buildMembershipTimeline([person('1', 'A B', ['2020-01-01'], null)]).people[0].isActive).toBe(false)
    expect(buildMembershipTimeline(null)).toEqual({ people: [], allYears: [] })
  })
})

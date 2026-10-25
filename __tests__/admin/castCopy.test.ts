import { castRowsToCopy, type CastRow } from '@/lib/admin/castCopy'

const row = (person_id: string | null, role = 'actor', character_name: string | null = null, sort_order: number | null = null): CastRow => ({
  person_id,
  role,
  character_name,
  sort_order,
  costume_url: 'https://c.test/x',
  notes: 'n',
})

describe('castRowsToCopy', () => {
  it('copies every field to the target date', () => {
    expect(castRowsToCopy([row('p1', 'actor', 'Ercole', 2)], [], 'D2')).toEqual([
      { date_id: 'D2', person_id: 'p1', role: 'actor', character_name: 'Ercole', sort_order: 2, costume_url: 'https://c.test/x', notes: 'n' },
    ])
  })

  it('skips entries already on the target (same person, role and character)', () => {
    const out = castRowsToCopy([row('p1', 'actor', 'Ercole'), row('p2', 'actor', 'Megara')], [row('p1', 'actor', 'Ercole')], 'D2')
    expect(out.map((r) => r.person_id)).toEqual(['p2'])
  })

  it('keeps the same person in a different role or character', () => {
    const out = castRowsToCopy([row('p1', 'director'), row('p1', 'actor', 'Fil')], [row('p1', 'actor', 'Ercole')], 'D2')
    expect(out).toHaveLength(2)
  })

  it('ignores source rows without a person', () => {
    expect(castRowsToCopy([row(null)], [], 'D2')).toEqual([])
  })
})

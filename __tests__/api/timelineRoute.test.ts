jest.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }))
jest.mock('@/lib/getPeople', () => ({ getPeopleTimeline: jest.fn() }))

import { getPeopleTimeline } from '@/lib/getPeople'
import { GET } from '@/app/api/attori/timeline/route'

const mockTimeline = getPeopleTimeline as jest.Mock

describe('GET /api/attori/timeline', () => {
  it('returns the shaped timeline with edge cache headers', async () => {
    mockTimeline.mockResolvedValue([
      { id: '1', name: 'Mario Rossi', role: 'actor', is_active: true, performance_people: [{ dates: { date: '2019-05-01' } }] },
    ])
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toMatch(/s-maxage=3600/)
    expect(await res.json()).toEqual({
      people: [{ id: '1', name: 'Mario Rossi', role: 'actor', isActive: true, years: ['2019'] }],
      allYears: ['2019'],
    })
  })

  it('answers 502 without leaking the database error', async () => {
    mockTimeline.mockRejectedValue(new Error('secret detail'))
    const res = await GET()
    expect(res.status).toBe(502)
    expect(JSON.stringify(await res.json())).not.toMatch(/secret/)
  })
})

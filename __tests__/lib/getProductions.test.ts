jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

import { supabase } from '@/lib/supabase'
import { getAllProductions, getProductionsByPlay } from '@/lib/getProductions'

const mockFrom = supabase.from as jest.Mock

function buildChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'order']
  methods.forEach((m) => { chain[m] = jest.fn().mockReturnThis() })
  chain['order'] = jest.fn().mockResolvedValue(result)
  return chain
}

const prod2024 = {
  id: 'prod-1', season_year: '2024', notes: null,
  plays: { title: 'Amleto', slug: 'amleto', poster_url: null, short_desc: null },
  dates: [{ id: 'date-1', date: '2024-11-15', time: '21:00:00', theater_name: 'Teatro Sociale', city: 'Milano' }],
}
const prod2022 = {
  id: 'prod-2', season_year: '2022', notes: null,
  plays: { title: 'Amleto', slug: 'amleto', poster_url: null, short_desc: null },
  dates: [{ id: 'date-2', date: '2022-05-10', time: '20:30:00', theater_name: 'Teatro Piccolo', city: 'Roma' }],
}

describe('getAllProductions', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns productions sorted by season_year descending', async () => {
    const chain = buildChain({ data: [prod2024, prod2022], error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getAllProductions()

    expect(mockFrom).toHaveBeenCalledWith('productions')
    expect(chain.order).toHaveBeenCalledWith('season_year', { ascending: false })
    expect(result).toHaveLength(2)
    expect((result as typeof prod2024[])[0].season_year).toBe('2024')
  })

  it('includes play info and dates', async () => {
    const chain = buildChain({ data: [prod2024], error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getAllProductions() as typeof prod2024[]

    expect(result[0].plays.title).toBe('Amleto')
    expect(result[0].dates[0].theater_name).toBe('Teatro Sociale')
  })

  it('throws on error', async () => {
    const chain = buildChain({ data: null, error: new Error('DB error') })
    mockFrom.mockReturnValue(chain)

    await expect(getAllProductions()).rejects.toThrow('DB error')
  })
})

describe('getProductionsByPlay', () => {
  afterEach(() => jest.clearAllMocks())

  it('filters by play_id', async () => {
    const chain = buildChain({ data: [prod2024, prod2022], error: null })
    mockFrom.mockReturnValue(chain)

    await getProductionsByPlay('play-uuid-123')

    expect(chain.eq).toHaveBeenCalledWith('play_id', 'play-uuid-123')
    expect(chain.order).toHaveBeenCalledWith('season_year', { ascending: false })
  })

  it('throws on error', async () => {
    const chain = buildChain({ data: null, error: new Error('fail') })
    mockFrom.mockReturnValue(chain)

    await expect(getProductionsByPlay('x')).rejects.toThrow('fail')
  })
})

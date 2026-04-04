jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

import { supabase } from '@/lib/supabase'
import { getPeople, getActivePeople, getPersonBySlug } from '@/lib/getPeople'

const mockFrom = supabase.from as jest.Mock

function buildChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'order', 'single']
  methods.forEach((m) => {
    chain[m] = jest.fn().mockReturnThis()
  })
  chain['single'] = jest.fn().mockResolvedValue(result)
  chain['order'] = jest.fn().mockResolvedValue(result)
  return chain
}

const personA = {
  id: '1', slug: 'mario-rossi', name: 'Mario Rossi',
  role: 'actor', bio: null, photo_url: null, joined_at: '2020-01-01', is_active: true,
}
const personB = {
  id: '2', slug: 'giulia-bianchi', name: 'Giulia Bianchi',
  role: 'director', bio: 'Regista', photo_url: null, joined_at: '2019-06-01', is_active: false,
}

describe('getPeople', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns all people sorted by name', async () => {
    const chain = buildChain({ data: [personA, personB], error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getPeople()

    expect(mockFrom).toHaveBeenCalledWith('people')
    expect(chain.order).toHaveBeenCalledWith('name', { ascending: true })
    expect(result).toHaveLength(2)
  })

  it('throws when Supabase returns an error', async () => {
    const chain = buildChain({ data: null, error: new Error('DB error') })
    mockFrom.mockReturnValue(chain)

    await expect(getPeople()).rejects.toThrow('DB error')
  })
})

describe('getActivePeople', () => {
  afterEach(() => jest.clearAllMocks())

  it('filters by is_active = true', async () => {
    const chain = buildChain({ data: [personA], error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getActivePeople()

    expect(chain.eq).toHaveBeenCalledWith('is_active', true)
    expect(result).toHaveLength(1)
  })

  it('throws on error', async () => {
    const chain = buildChain({ data: null, error: new Error('fail') })
    mockFrom.mockReturnValue(chain)

    await expect(getActivePeople()).rejects.toThrow('fail')
  })
})

describe('getPersonBySlug', () => {
  afterEach(() => jest.clearAllMocks())

  const fullPerson = {
    ...personA,
    performance_people: [
      {
        character_name: 'Amleto',
        role: 'actor',
        notes: null,
        dates: {
          date: '2024-11-15',
          theater_name: 'Teatro Sociale',
          city: 'Milano',
          productions: { season_year: '2024', plays: { title: 'Amleto', slug: 'amleto' } },
        },
      },
    ],
  }

  it('queries by slug and returns person with history', async () => {
    const chain = buildChain({ data: fullPerson, error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getPersonBySlug('mario-rossi')

    expect(chain.eq).toHaveBeenCalledWith('slug', 'mario-rossi')
    expect(chain.single).toHaveBeenCalled()
    expect(result).toEqual(fullPerson)
  })

  it('includes performance history with play info', async () => {
    const chain = buildChain({ data: fullPerson, error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getPersonBySlug('mario-rossi') as typeof fullPerson

    expect(result.performance_people[0].character_name).toBe('Amleto')
    expect(result.performance_people[0].dates.productions.plays.title).toBe('Amleto')
  })

  it('throws on error', async () => {
    const chain = buildChain({ data: null, error: new Error('not found') })
    mockFrom.mockReturnValue(chain)

    await expect(getPersonBySlug('nobody')).rejects.toThrow('not found')
  })
})

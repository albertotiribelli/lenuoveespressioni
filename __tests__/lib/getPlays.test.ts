jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

import { supabase } from '@/lib/supabase'
import { getPlays, getPlayBySlug } from '@/lib/getPlays'

const mockFrom = supabase.from as jest.Mock

function buildChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'order', 'single']
  methods.forEach((m) => { chain[m] = jest.fn().mockReturnThis() })
  chain['single'] = jest.fn().mockResolvedValue(result)
  chain['order'] = jest.fn().mockResolvedValue(result)
  return chain
}

const playA = {
  id: '1', slug: 'amleto', title: 'Amleto',
  short_desc: 'Il principe di Danimarca.', poster_url: null,
  youtube_url: null,
}
const playB = {
  id: '2', slug: 'sei-personaggi', title: 'Sei personaggi in cerca d\'autore',
  short_desc: null, poster_url: null, youtube_url: null,
}

const fullPlay = {
  ...playA,
  description: 'Testo completo...',
  productions: [
    {
      id: 'prod-1',
      season_year: '2024',
      notes: null,
      dates: [
        {
          id: 'date-1',
          date: '2024-11-15',
          time: '21:00:00',
          theater_name: 'Teatro Sociale',
          city: 'Milano',
          notes: null,
          performance_people: [
            {
              character_name: 'Amleto',
              role: 'actor',
              people: { id: '1', slug: 'mario-rossi', name: 'Mario Rossi', photo_url: null },
            },
          ],
        },
      ],
    },
  ],
}

describe('getPlays', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns all plays sorted by title', async () => {
    const chain = buildChain({ data: [playA, playB], error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getPlays()

    expect(mockFrom).toHaveBeenCalledWith('plays')
    expect(chain.order).toHaveBeenCalledWith('title', { ascending: true })
    expect(result).toHaveLength(2)
  })

  it('throws on error', async () => {
    const chain = buildChain({ data: null, error: new Error('DB error') })
    mockFrom.mockReturnValue(chain)

    await expect(getPlays()).rejects.toThrow('DB error')
  })
})

describe('getPlayBySlug', () => {
  afterEach(() => jest.clearAllMocks())

  it('queries by slug', async () => {
    const chain = buildChain({ data: fullPlay, error: null })
    mockFrom.mockReturnValue(chain)

    await getPlayBySlug('amleto')

    expect(chain.eq).toHaveBeenCalledWith('slug', 'amleto')
    expect(chain.single).toHaveBeenCalled()
  })

  it('includes productions with cast linked to people', async () => {
    const chain = buildChain({ data: fullPlay, error: null })
    mockFrom.mockReturnValue(chain)

    const result = await getPlayBySlug('amleto') as typeof fullPlay

    const actor = result.productions[0].dates[0].performance_people[0]
    expect(actor.character_name).toBe('Amleto')
    expect(actor.people.slug).toBe('mario-rossi')
  })

  it('throws on error', async () => {
    const chain = buildChain({ data: null, error: new Error('not found') })
    mockFrom.mockReturnValue(chain)

    await expect(getPlayBySlug('nonexistent')).rejects.toThrow('not found')
  })
})

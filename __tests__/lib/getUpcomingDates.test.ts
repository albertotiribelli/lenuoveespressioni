// __tests__/lib/getUpcomingDates.test.ts

// Mock the supabase module before importing the function under test
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

import { supabase } from '@/lib/supabase'
import { getUpcomingDates } from '@/lib/getUpcomingDates'

const mockFrom = supabase.from as jest.Mock

// Helper to build a fluent Supabase query mock that resolves with { data, error }
function buildQueryMock(result: { data: unknown; error: unknown }) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(result),
  }
  return chain
}

const TODAY = new Date().toISOString().slice(0, 10)

const futureDateA = {
  id: '1',
  date: '2099-06-01',
  time: '21:00:00',
  theater_name: 'Teatro Sociale',
  city: 'Milano',
  notes: null,
  productions: {
    season_year: '2099',
    plays: {
      title: 'Aspettando Godot',
      slug: 'aspettando-godot',
      poster_url: null,
      short_desc: 'Un classico senza tempo.',
    },
  },
}

const futureDateB = {
  id: '2',
  date: '2099-09-15',
  time: '20:30:00',
  theater_name: 'Teatro Piccolo',
  city: 'Roma',
  notes: null,
  productions: {
    season_year: '2099',
    plays: {
      title: 'Sei personaggi',
      slug: 'sei-personaggi',
      poster_url: null,
      short_desc: null,
    },
  },
}

const pastDate = {
  id: '3',
  date: '2000-01-01',
  time: '20:00:00',
  theater_name: 'Teatro Antico',
  city: 'Torino',
  notes: null,
  productions: {
    season_year: '2000',
    plays: {
      title: 'Vecchio spettacolo',
      slug: 'vecchio-spettacolo',
      poster_url: null,
      short_desc: null,
    },
  },
}

describe('getUpcomingDates', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns only future dates (Supabase filters by date >= today)', async () => {
    // The function delegates filtering to Supabase (.gte); simulate that the
    // DB correctly returns only future rows.
    const queryMock = buildQueryMock({ data: [futureDateA, futureDateB], error: null })
    mockFrom.mockReturnValue(queryMock)

    const result = await getUpcomingDates()

    // .gte must have been called with today's date (at minimum the date part matches)
    expect(queryMock.gte).toHaveBeenCalledWith('date', expect.stringContaining(TODAY.slice(0, 7)))

    expect(result).toHaveLength(2)
    result!.forEach((row) => {
      expect(new Date(row.date).getTime()).toBeGreaterThan(Date.now())
    })
  })

  it('returns dates sorted ascending', async () => {
    const queryMock = buildQueryMock({ data: [futureDateA, futureDateB], error: null })
    mockFrom.mockReturnValue(queryMock)

    const result = await getUpcomingDates()

    expect(queryMock.order).toHaveBeenCalledWith('date', { ascending: true })
    // Verify the actual order of returned data
    const dates = result!.map((r) => r.date)
    const sorted = [...dates].sort()
    expect(dates).toEqual(sorted)
  })

  it('includes play title in nested productions', async () => {
    const queryMock = buildQueryMock({ data: [futureDateA], error: null })
    mockFrom.mockReturnValue(queryMock)

    const result = await getUpcomingDates()

    expect(result).toHaveLength(1)
    const row = result![0] as typeof futureDateA
    expect(row.productions?.plays?.title).toBe('Aspettando Godot')
  })

  it('does not include past dates when DB filters correctly', async () => {
    // Simulate DB returning empty because past date was filtered out
    const queryMock = buildQueryMock({ data: [], error: null })
    mockFrom.mockReturnValue(queryMock)

    const result = await getUpcomingDates()

    expect(result).toHaveLength(0)
  })

  it('throws when Supabase returns an error', async () => {
    const queryMock = buildQueryMock({ data: null, error: new Error('DB error') })
    mockFrom.mockReturnValue(queryMock)

    await expect(getUpcomingDates()).rejects.toThrow('DB error')
  })
})

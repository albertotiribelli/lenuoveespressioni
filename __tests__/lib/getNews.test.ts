jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

import { supabase } from '@/lib/supabase'
import { getNewsBySlug, getNewsForPlay, getNewsList, getNewsSlugs } from '@/lib/getNews'

const mockFrom = supabase.from as jest.Mock

// Every builder method returns the chain; awaiting the chain (or maybeSingle) resolves to `result`.
function chain(result: { data: unknown; error: unknown }) {
  const c: Record<string, unknown> = {}
  const resolve = Promise.resolve(result)
  for (const m of ['select', 'eq', 'order']) c[m] = jest.fn().mockReturnValue(c)
  c.maybeSingle = jest.fn().mockResolvedValue(result)
  c.then = resolve.then.bind(resolve)
  mockFrom.mockReturnValue(c)
  return c
}

const row = { id: '1', slug: 'primo', title: 'Primo', body: 'Testo', published_at: '2026-10-01T10:00:00Z', plays: null }
const MISSING = { code: 'PGRST205', message: "Could not find the table 'public.news'" }

beforeEach(() => jest.clearAllMocks())

describe('getNewsList', () => {
  it('returns the posts, newest first', async () => {
    const c = chain({ data: [row], error: null })
    expect(await getNewsList()).toEqual([row])
    expect(mockFrom).toHaveBeenCalledWith('news')
    expect(c.order).toHaveBeenCalledWith('published_at', { ascending: false })
  })

  it('returns an empty list when the table does not exist yet', async () => {
    chain({ data: null, error: MISSING })
    expect(await getNewsList()).toEqual([])
    chain({ data: null, error: { code: '42P01' } })
    expect(await getNewsList()).toEqual([])
  })

  it('still throws on other errors', async () => {
    chain({ data: null, error: { code: '500', message: 'boom' } })
    await expect(getNewsList()).rejects.toMatchObject({ message: 'boom' })
  })
})

describe('getNewsBySlug', () => {
  it('returns the post, or null when there is none', async () => {
    const c = chain({ data: row, error: null })
    expect(await getNewsBySlug('primo')).toEqual(row)
    expect(c.eq).toHaveBeenCalledWith('slug', 'primo')
    chain({ data: null, error: null })
    expect(await getNewsBySlug('nope')).toBeNull()
  })

  it('returns null when the table does not exist yet', async () => {
    chain({ data: null, error: MISSING })
    expect(await getNewsBySlug('primo')).toBeNull()
  })
})

describe('getNewsSlugs and getNewsForPlay', () => {
  it('list slugs and the posts linked to a play', async () => {
    chain({ data: [{ slug: 'primo' }], error: null })
    expect(await getNewsSlugs()).toEqual([{ slug: 'primo' }])
    const c = chain({ data: [row], error: null })
    expect(await getNewsForPlay('play-1')).toEqual([row])
    expect(c.eq).toHaveBeenCalledWith('play_id', 'play-1')
  })

  it('return empty when the table does not exist yet', async () => {
    chain({ data: null, error: MISSING })
    expect(await getNewsSlugs()).toEqual([])
    expect(await getNewsForPlay('play-1')).toEqual([])
  })
})

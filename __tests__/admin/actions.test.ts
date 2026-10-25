jest.mock('next/cache', () => ({ revalidatePath: jest.fn(), updateTag: jest.fn() }))
jest.mock('next/headers', () => ({ headers: jest.fn().mockResolvedValue({ get: () => 'https://site.test' }) }))
jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))
jest.mock('@/lib/supabase/server', () => ({ createSupabaseServerClient: jest.fn() }))
jest.mock('@/lib/admin/requireAdmin', () => ({
  ...jest.requireActual('@/lib/admin/requireAdmin'),
  requireAdmin: jest.fn(),
}))

import { revalidatePath, updateTag } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotAdminError, requireAdmin } from '@/lib/admin/requireAdmin'
import {
  createCastEntry,
  createDate,
  createPerson,
  createPlay,
  createProduction,
  deleteCastEntry,
  deleteDate,
  deletePerson,
  deletePlay,
  deleteProduction,
  sendMagicLink,
  updateDate,
  updatePerformancePerson,
  updatePerson,
  updatePlay,
  updateProduction,
} from '@/app/admin/actions'

const mockRequireAdmin = requireAdmin as jest.Mock
const mockCreateClient = createSupabaseServerClient as jest.Mock
const ID = '123e4567-e89b-12d3-a456-426614174000'
const PREV = { ok: false }

function form(entries: Record<string, string>) {
  const f = new FormData()
  Object.entries(entries).forEach(([k, v]) => f.set(k, v))
  return f
}

// Fluent mock for supabase.from(t).update().eq().select().maybeSingle()
function updateChain(result: { data: unknown; error: unknown }) {
  const chain = {
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
  }
  const supabase = { from: jest.fn().mockReturnValue(chain) }
  mockRequireAdmin.mockResolvedValue({ user: { email: 'admin@x.it' }, supabase })
  return { chain, supabase }
}

const validPerson = { name: 'Mario', role: 'actor', joined_at: '2015-01-01' }
const validDate = { date: '2026-10-24', theater_name: 'Teatro Sociale', tickets_url: 'https://tickets.test/x' }

beforeEach(() => jest.clearAllMocks())

describe('updatePerson', () => {
  it('rejects non-admins without touching the database', async () => {
    mockRequireAdmin.mockRejectedValue(new NotAdminError())
    const r = await updatePerson(ID, PREV, form(validPerson))
    expect(r).toEqual({ ok: false, error: 'Non autorizzato' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns field errors for invalid input and does not write', async () => {
    const { supabase } = updateChain({ data: null, error: null })
    const r = await updatePerson(ID, PREV, form({ ...validPerson, name: '' }))
    expect(r.ok).toBe(false)
    expect(r.fieldErrors?.name).toBeDefined()
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('rejects a malformed id', async () => {
    updateChain({ data: null, error: null })
    expect((await updatePerson('not-a-uuid', PREV, form(validPerson))).ok).toBe(false)
  })

  it('hides raw database errors', async () => {
    updateChain({ data: null, error: { message: 'relation "people" secret detail' } })
    const r = await updatePerson(ID, PREV, form(validPerson))
    expect(r.ok).toBe(false)
    expect(r.error).not.toMatch(/secret/)
  })

  it('reports a missing row (RLS denial or wrong id) instead of success', async () => {
    updateChain({ data: null, error: null })
    expect((await updatePerson(ID, PREV, form(validPerson))).ok).toBe(false)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates the row and revalidates the people pages', async () => {
    const { chain, supabase } = updateChain({ data: { slug: 'mario-rossi' }, error: null })
    const r = await updatePerson(ID, PREV, form({ ...validPerson, is_active: 'on' }))
    expect(r).toEqual({ ok: true })
    expect(supabase.from).toHaveBeenCalledWith('people')
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'Mario', is_active: true }))
    expect(chain.eq).toHaveBeenCalledWith('id', ID)
    expect(updateTag).toHaveBeenCalledWith('people')
    expect(revalidatePath).toHaveBeenCalledWith('/attori')
    expect(revalidatePath).toHaveBeenCalledWith('/attori/mario-rossi')
  })
})

describe('updateDate', () => {
  it('rejects non-admins', async () => {
    mockRequireAdmin.mockRejectedValue(new NotAdminError())
    expect(await updateDate(ID, PREV, form(validDate))).toEqual({ ok: false, error: 'Non autorizzato' })
  })

  it('returns field errors for a bad ticket URL', async () => {
    updateChain({ data: null, error: null })
    const r = await updateDate(ID, PREV, form({ ...validDate, tickets_url: 'ftp://nope' }))
    expect(r.fieldErrors?.tickets_url).toBeDefined()
  })

  it('updates the date and revalidates home, plays and archive', async () => {
    const { chain } = updateChain({ data: { id: ID }, error: null })
    const r = await updateDate(ID, PREV, form(validDate))
    expect(r).toEqual({ ok: true })
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({ tickets_url: 'https://tickets.test/x' }))
    expect(updateTag).toHaveBeenCalledWith('dates')
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/spettacoli/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/archivio')
  })
})

interface UpdateCase {
  name: string
  action: (id: string, prev: { ok: boolean }, formData: FormData) => Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string> }>
  table: string
  valid: Record<string, string>
  invalid: Record<string, string>
  returned: Record<string, string>
  expectedPaths: string[][]
  expectedTags: string[]
  expectedUpdate: Record<string, unknown>
}

const updateCases: UpdateCase[] = [
  {
    name: 'updatePlay',
    action: updatePlay,
    table: 'plays',
    valid: { title: 'Hercules' },
    invalid: { title: '' },
    returned: { slug: 'hercules' },
    expectedPaths: [['/spettacoli'], ['/spettacoli/[slug]', 'page'], ['/media'], ['/']],
    expectedTags: [],
    expectedUpdate: { title: 'Hercules' },
  },
  {
    name: 'updateProduction',
    action: updateProduction,
    table: 'productions',
    valid: { season_year: '2024' },
    invalid: { season_year: '' },
    returned: { id: ID },
    expectedPaths: [['/spettacoli/[slug]', 'page'], ['/archivio']],
    expectedTags: ['dates'],
    expectedUpdate: { season_year: '2024', notes: null },
  },
  {
    name: 'updatePerformancePerson',
    action: updatePerformancePerson,
    table: 'performance_people',
    valid: { role: 'actor', sort_order: '2' },
    invalid: { role: 'wizard' },
    returned: { id: ID },
    expectedPaths: [['/spettacoli/[slug]', 'page'], ['/attori/[slug]', 'page'], ['/archivio']],
    expectedTags: ['people', 'dates'],
    expectedUpdate: { role: 'actor', sort_order: 2 },
  },
]

describe.each(updateCases)('$name', ({ action, table, valid, invalid, returned, expectedPaths, expectedTags, expectedUpdate }) => {
  it('rejects non-admins without touching the database', async () => {
    mockRequireAdmin.mockRejectedValue(new NotAdminError())
    expect(await action(ID, PREV, form(valid))).toEqual({ ok: false, error: 'Non autorizzato' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns field errors for invalid input and does not write', async () => {
    const { supabase } = updateChain({ data: null, error: null })
    const r = await action(ID, PREV, form(invalid))
    expect(r.ok).toBe(false)
    expect(r.fieldErrors).toBeDefined()
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('rejects a malformed id', async () => {
    updateChain({ data: null, error: null })
    expect((await action('not-a-uuid', PREV, form(valid))).ok).toBe(false)
  })

  it('hides raw database errors', async () => {
    updateChain({ data: null, error: { message: 'secret detail' } })
    const r = await action(ID, PREV, form(valid))
    expect(r.ok).toBe(false)
    expect(r.error).not.toMatch(/secret/)
  })

  it('reports a missing row (RLS denial or wrong id) instead of success', async () => {
    updateChain({ data: null, error: null })
    expect((await action(ID, PREV, form(valid))).ok).toBe(false)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates the right table and revalidates the public pages', async () => {
    const { chain, supabase } = updateChain({ data: returned, error: null })
    expect(await action(ID, PREV, form(valid))).toEqual({ ok: true })
    expect(supabase.from).toHaveBeenCalledWith(table)
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining(expectedUpdate))
    expect(chain.eq).toHaveBeenCalledWith('id', ID)
    expectedPaths.forEach((args) => expect(revalidatePath).toHaveBeenCalledWith(...(args as [string, 'page'?])))
    expectedTags.forEach((tag) => expect(updateTag).toHaveBeenCalledWith(tag))
  })
})

describe('sendMagicLink', () => {
  const original = process.env.ADMIN_EMAILS
  afterAll(() => {
    process.env.ADMIN_EMAILS = original
  })

  function authClient() {
    const signInWithOtp = jest.fn().mockResolvedValue({ error: null })
    mockCreateClient.mockResolvedValue({ auth: { signInWithOtp } })
    return signInWithOtp
  }

  it('sends a link to an allowed email without creating users', async () => {
    process.env.ADMIN_EMAILS = 'admin@x.it'
    const signInWithOtp = authClient()
    const r = await sendMagicLink(PREV, form({ email: ' Admin@x.it ' }))
    expect(r).toEqual({ ok: true })
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'admin@x.it',
      options: { shouldCreateUser: false, emailRedirectTo: 'https://site.test/auth/callback' },
    })
  })

  it('answers the same for a non-allowed email but sends nothing', async () => {
    process.env.ADMIN_EMAILS = 'admin@x.it'
    const signInWithOtp = authClient()
    expect(await sendMagicLink(PREV, form({ email: 'intruder@x.it' }))).toEqual({ ok: true })
    expect(signInWithOtp).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

// Mock for supabase.from(t).insert().select().maybeSingle() plus the slug lookup
// supabase.from(t).select('slug').like(), which resolves to `slugs`.
function insertClient(result: { data: unknown; error: unknown }, slugs: string[] = []) {
  const chain = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    like: jest.fn().mockResolvedValue({ data: slugs.map((slug) => ({ slug })), error: null }),
    maybeSingle: jest.fn().mockResolvedValue(result),
  }
  const supabase = { from: jest.fn().mockReturnValue(chain) }
  mockRequireAdmin.mockResolvedValue({ user: { email: 'admin@x.it' }, supabase })
  return { chain, supabase }
}

const NEW_ID = '223e4567-e89b-12d3-a456-426614174999'

describe('createPerson', () => {
  const valid = { name: 'Mario Rossi', role: 'actor', joined_at: '2015-01-01', is_active: 'on' }

  it('rejects non-admins', async () => {
    mockRequireAdmin.mockRejectedValue(new NotAdminError())
    expect(await createPerson(PREV, form(valid))).toEqual({ ok: false, error: 'Non autorizzato' })
  })

  it('returns field errors without writing', async () => {
    const { chain } = insertClient({ data: null, error: null })
    const r = await createPerson(PREV, form({ ...valid, name: '' }))
    expect(r.fieldErrors?.name).toBeDefined()
    expect(chain.insert).not.toHaveBeenCalled()
  })

  it('inserts with a generated slug, revalidates (including the sitemap) and redirects to the new row', async () => {
    const { chain } = insertClient({ data: { id: NEW_ID }, error: null })
    await expect(createPerson(PREV, form(valid))).rejects.toThrow(`NEXT_REDIRECT:/admin/people/${NEW_ID}`)
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ name: 'Mario Rossi', slug: 'mario_rossi', is_active: true }))
    expect(updateTag).toHaveBeenCalledWith('people')
    expect(revalidatePath).toHaveBeenCalledWith('/attori')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })

  it('adds a numeric suffix when the slug is already taken', async () => {
    const { chain } = insertClient({ data: { id: NEW_ID }, error: null }, ['mario_rossi', 'mario_rossi_2'])
    await expect(createPerson(PREV, form(valid))).rejects.toThrow('NEXT_REDIRECT')
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ slug: 'mario_rossi_3' }))
  })

  it('reports a duplicate key and hides other database errors', async () => {
    insertClient({ data: null, error: { code: '23505', message: 'dup' } })
    expect((await createPerson(PREV, form(valid))).error).toMatch(/Esiste già/)
    insertClient({ data: null, error: { code: 'XX', message: 'secret detail' } })
    expect((await createPerson(PREV, form(valid))).error).not.toMatch(/secret/)
  })

  it('reports a denied insert (RLS returns no row) instead of success', async () => {
    insertClient({ data: null, error: null })
    expect((await createPerson(PREV, form(valid))).ok).toBe(false)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe('createPlay', () => {
  it('inserts with a slug from the title and redirects', async () => {
    const { chain } = insertClient({ data: { id: NEW_ID }, error: null })
    await expect(createPlay(PREV, form({ title: 'Il Re Leone' }))).rejects.toThrow(`NEXT_REDIRECT:/admin/plays/${NEW_ID}`)
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ title: 'Il Re Leone', slug: 'il_re_leone' }))
    expect(revalidatePath).toHaveBeenCalledWith('/spettacoli/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })
})

describe('createProduction, createDate and createCastEntry', () => {
  const PARENT = '123e4567-e89b-12d3-a456-426614174000'

  it('attach the new row to its parent', async () => {
    let c = insertClient({ data: { id: NEW_ID }, error: null })
    await expect(createProduction(PARENT, PREV, form({ season_year: '2027' }))).rejects.toThrow(`NEXT_REDIRECT:/admin/productions/${NEW_ID}`)
    expect(c.chain.insert).toHaveBeenCalledWith(expect.objectContaining({ season_year: '2027', play_id: PARENT }))

    c = insertClient({ data: { id: NEW_ID }, error: null })
    await expect(createDate(PARENT, PREV, form(validDate))).rejects.toThrow(`NEXT_REDIRECT:/admin/dates/${NEW_ID}`)
    expect(c.chain.insert).toHaveBeenCalledWith(expect.objectContaining({ theater_name: 'Teatro Sociale', production_id: PARENT }))

    c = insertClient({ data: { id: NEW_ID }, error: null })
    await expect(createCastEntry(PARENT, PREV, form({ person_id: ID, role: 'actor' }))).rejects.toThrow(`NEXT_REDIRECT:/admin/dates/${PARENT}/cast`)
    expect(c.chain.insert).toHaveBeenCalledWith(expect.objectContaining({ person_id: ID, role: 'actor', date_id: PARENT }))
    expect(updateTag).toHaveBeenCalledWith('people')
  })

  it('reject a malformed parent id without touching the database', async () => {
    const { supabase } = insertClient({ data: null, error: null })
    expect((await createProduction('nope', PREV, form({ season_year: '2027' }))).ok).toBe(false)
    expect((await createDate('nope', PREV, form(validDate))).ok).toBe(false)
    expect((await createCastEntry('nope', PREV, form({ person_id: ID, role: 'actor' }))).ok).toBe(false)
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('require a person for a cast entry', async () => {
    insertClient({ data: null, error: null })
    expect((await createCastEntry(PARENT, PREV, form({ role: 'actor' }))).fieldErrors?.person_id).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

// Mock for the dependency count (from().select(cols, opts).eq() -> { count }) and the delete
// (from().delete().eq().select().maybeSingle()). `counts` is consumed in order, one per blocker.
function deleteClient(opts: { counts?: number[]; deleted?: unknown; error?: unknown }) {
  const counts = [...(opts.counts ?? [])]
  const chain = {
    select: jest.fn().mockImplementation((_cols: string, options?: { head?: boolean }) =>
      options?.head ? { eq: jest.fn().mockResolvedValue({ count: counts.shift() ?? 0, error: null }) } : chain
    ),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: opts.deleted ?? null, error: opts.error ?? null }),
  }
  const supabase = { from: jest.fn().mockReturnValue(chain) }
  mockRequireAdmin.mockResolvedValue({ user: { email: 'admin@x.it' }, supabase })
  return { chain, supabase }
}

describe.each([
  { name: 'deletePerson', run: () => deletePerson(ID, PREV, new FormData()), table: 'people', blockedBy: 'performance_people', message: /voci di cast/, to: '/admin/people' },
  { name: 'deletePlay', run: () => deletePlay(ID, PREV, new FormData()), table: 'plays', blockedBy: 'productions', message: /produzion/, to: '/admin/plays' },
  { name: 'deleteProduction', run: () => deleteProduction(ID, PREV, new FormData()), table: 'productions', blockedBy: 'dates', message: /date/, to: '/admin/plays' },
  { name: 'deleteDate', run: () => deleteDate(ID, PREV, new FormData()), table: 'dates', blockedBy: 'performance_people', message: /voci di cast/, to: '/admin/dates' },
])('$name', ({ run, table, blockedBy, message, to }) => {
  it('rejects non-admins', async () => {
    mockRequireAdmin.mockRejectedValue(new NotAdminError())
    expect(await run()).toEqual({ ok: false, error: 'Non autorizzato' })
  })

  it('is blocked, and does not delete, while dependent rows exist', async () => {
    const { chain, supabase } = deleteClient({ counts: [3], deleted: { id: ID } })
    const r = await run()
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(message)
    expect(r.error).toMatch(/3/)
    expect(supabase.from).toHaveBeenCalledWith(blockedBy)
    expect(chain.delete).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes a row with no dependents, revalidates and redirects to the list', async () => {
    const { chain, supabase } = deleteClient({ counts: [0], deleted: { id: ID } })
    await expect(run()).rejects.toThrow(`NEXT_REDIRECT:${to}`)
    expect(supabase.from).toHaveBeenCalledWith(table)
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', ID)
    expect(revalidatePath).toHaveBeenCalled()
  })

  it('reports a denied delete (RLS returns no row) instead of success', async () => {
    deleteClient({ counts: [0], deleted: null })
    const r = await run()
    expect(r.ok).toBe(false)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('hides raw database errors', async () => {
    deleteClient({ counts: [0], error: { message: 'secret detail' } })
    expect((await run()).error).not.toMatch(/secret/)
  })
})

describe('deleteCastEntry', () => {
  it('is never blocked, and returns to the cast list of the date', async () => {
    const { chain } = deleteClient({ deleted: { id: ID } })
    await expect(deleteCastEntry('323e4567-e89b-12d3-a456-426614174000', ID, PREV, new FormData())).rejects.toThrow(
      'NEXT_REDIRECT:/admin/dates/323e4567-e89b-12d3-a456-426614174000/cast'
    )
    expect(chain.delete).toHaveBeenCalled()
    expect(updateTag).toHaveBeenCalledWith('people')
  })

  it('rejects malformed ids', async () => {
    deleteClient({ deleted: { id: ID } })
    expect((await deleteCastEntry('nope', ID, PREV, new FormData())).ok).toBe(false)
    expect((await deleteCastEntry('323e4567-e89b-12d3-a456-426614174000', 'nope', PREV, new FormData())).ok).toBe(false)
  })
})

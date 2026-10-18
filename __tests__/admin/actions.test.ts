jest.mock('next/cache', () => ({ revalidatePath: jest.fn(), updateTag: jest.fn() }))
jest.mock('next/headers', () => ({ headers: jest.fn().mockResolvedValue({ get: () => 'https://site.test' }) }))
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/lib/supabase/server', () => ({ createSupabaseServerClient: jest.fn() }))
jest.mock('@/lib/admin/requireAdmin', () => ({
  ...jest.requireActual('@/lib/admin/requireAdmin'),
  requireAdmin: jest.fn(),
}))

import { revalidatePath, updateTag } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotAdminError, requireAdmin } from '@/lib/admin/requireAdmin'
import { sendMagicLink, updateDate, updatePerson } from '@/app/admin/actions'

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

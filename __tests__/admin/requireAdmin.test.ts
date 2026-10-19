jest.mock('@/lib/supabase/server', () => ({ createSupabaseServerClient: jest.fn() }))

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotAdminError, parseAdminEmails, requireAdmin } from '@/lib/admin/requireAdmin'

const mockCreate = createSupabaseServerClient as jest.Mock

function sessionAs(user: { email?: string } | null) {
  mockCreate.mockResolvedValue({ auth: { getUser: jest.fn().mockResolvedValue({ data: { user } }) } })
}

describe('parseAdminEmails', () => {
  it('splits, trims, lowercases and drops empties', () => {
    expect(parseAdminEmails(' A@x.it, b@x.it ,,')).toEqual(['a@x.it', 'b@x.it'])
  })
  it('returns [] when unset', () => {
    expect(parseAdminEmails(undefined)).toEqual([])
  })
})

describe('requireAdmin', () => {
  const original = process.env.ADMIN_EMAILS
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'admin@x.it, Other@x.it'
  })
  afterAll(() => {
    process.env.ADMIN_EMAILS = original
  })

  it('rejects when there is no session', async () => {
    sessionAs(null)
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAdminError)
  })

  it('rejects a logged-in user whose email is not allowed', async () => {
    sessionAs({ email: 'intruder@x.it' })
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAdminError)
  })

  it('rejects everyone when ADMIN_EMAILS is empty', async () => {
    process.env.ADMIN_EMAILS = ''
    sessionAs({ email: 'admin@x.it' })
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAdminError)
  })

  it('accepts an allowed email, case-insensitively', async () => {
    sessionAs({ email: 'OTHER@x.it' })
    const { user } = await requireAdmin()
    expect(user.email).toBe('OTHER@x.it')
  })
})

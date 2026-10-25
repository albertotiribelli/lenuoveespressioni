/**
 * Security regression tests for the admin console (issue #17).
 *
 * `proxy.ts` only gates requests whose path starts with /admin. A Next.js server action can be invoked
 * with its action id from ANY route, so the proxy is not a boundary for actions: each action must check
 * the session itself. These tests fail when someone adds an admin action or page without that check.
 */
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

jest.mock('next/cache', () => ({ revalidatePath: jest.fn(), updateTag: jest.fn() }))
jest.mock('next/headers', () => ({ headers: jest.fn().mockResolvedValue({ get: () => 'https://site.test' }) }))
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/lib/supabase/server', () => ({ createSupabaseServerClient: jest.fn() }))

import { createSupabaseServerClient } from '@/lib/supabase/server'
import * as actions from '@/app/admin/actions'

const mockCreateClient = createSupabaseServerClient as jest.Mock
const UUID = '123e4567-e89b-12d3-a456-426614174000'

// Public by design: sendMagicLink (login) and signOut (only clears the caller's own session).
const PUBLIC_ACTIONS = new Set(['sendMagicLink', 'signOut'])
const guarded = Object.entries(actions).filter(
  (entry): entry is [string, (...args: unknown[]) => Promise<{ ok: boolean; error?: string }>] =>
    typeof entry[1] === 'function' && !PUBLIC_ACTIONS.has(entry[0])
)

// A Supabase client whose every table call is recorded, with a configurable session.
function clientWithSession(user: { email: string } | null) {
  const from = jest.fn()
  mockCreateClient.mockResolvedValue({ auth: { getUser: jest.fn().mockResolvedValue({ data: { user } }) }, from })
  return from
}

describe('server actions authorize on their own', () => {
  const originalEnv = process.env.ADMIN_EMAILS
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ADMIN_EMAILS = 'admin@x.it'
  })
  afterAll(() => {
    process.env.ADMIN_EMAILS = originalEnv
  })

  it('covers every exported admin action (so a new one cannot slip past this test)', () => {
    expect(guarded.map(([name]) => name).sort()).toEqual(
      [
        'copyCastFromDate',
        'createCastEntry',
        'createDate',
        'createPerson',
        'createPlay',
        'createProduction',
        'deleteCastEntry',
        'deleteDate',
        'deletePerson',
        'deletePlay',
        'deleteProduction',
        'updateDate',
        'updatePerformancePerson',
        'updatePerson',
        'updatePlay',
        'updateProduction',
      ].sort()
    )
  })

  describe.each([
    ['no session', null],
    ['a logged-in user that is not an admin', { email: 'intruder@x.it' }],
  ])('with %s', (_label, user) => {
    it.each(guarded)('%s refuses and never reaches the database', async (_name, action) => {
      const from = clientWithSession(user)
      // Valid ids and an empty form: only the missing authorization can explain a refusal.
      const result = await action(UUID, UUID, { ok: false }, new FormData())
      expect(result).toEqual({ ok: false, error: 'Non autorizzato' })
      expect(from).not.toHaveBeenCalled()
    })
  })
})

describe('admin pages guard themselves', () => {
  // Pages do not rely on proxy.ts alone: every page re-checks the session on the server.
  const root = join(process.cwd(), 'app', 'admin')
  const pages: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (name === 'page.tsx') pages.push(full)
    }
  }
  walk(root)

  it('finds the admin pages', () => {
    expect(pages.length).toBeGreaterThan(10)
  })

  it.each(pages.filter((p) => !p.endsWith(join('login', 'page.tsx'))).map((p) => [p.replace(root, 'app/admin'), p]))(
    '%s calls requireAdminPage()',
    (_label, file) => {
      expect(readFileSync(file, 'utf8')).toMatch(/await requireAdminPage\(\)/)
    }
  )
})

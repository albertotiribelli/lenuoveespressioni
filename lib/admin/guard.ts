// lib/admin/guard.ts — page-level wrapper: redirect instead of throwing
import { redirect } from 'next/navigation'
import { NotAdminError, requireAdmin } from './requireAdmin'

export async function requireAdminPage() {
  try {
    return await requireAdmin()
  } catch (e) {
    if (e instanceof NotAdminError) redirect('/admin/login?error=forbidden')
    throw e
  }
}

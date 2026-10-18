// lib/admin/requireAdmin.ts — server-side admin check used by every admin page and server action
import { createSupabaseServerClient } from '@/lib/supabase/server'

export class NotAdminError extends Error {
  constructor() {
    super('Not authorized')
    this.name = 'NotAdminError'
  }
}

export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  const email = data.user?.email?.toLowerCase()

  if (!data.user || !email || !parseAdminEmails(process.env.ADMIN_EMAILS).includes(email)) {
    throw new NotAdminError()
  }
  return { user: data.user, supabase }
}

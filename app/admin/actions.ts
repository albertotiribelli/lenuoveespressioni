'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotAdminError, parseAdminEmails, requireAdmin } from '@/lib/admin/requireAdmin'
import { parseDateInput, parsePersonInput, type FieldErrors } from '@/lib/admin/validation'

export interface ActionState {
  ok: boolean
  error?: string
  fieldErrors?: FieldErrors
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function sendMagicLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) return { ok: false, error: "Inserisci la tua email" }

  // Same response for allowed and non-allowed emails, to avoid revealing who is an admin.
  if (parseAdminEmails(process.env.ADMIN_EMAILS).includes(email)) {
    const h = await headers()
    const origin = h.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/callback` },
    })
    if (error) return { ok: false, error: "Impossibile inviare il link. Riprova tra poco." }
  }
  return { ok: true }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function updatePerson(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  let ctx
  try {
    ctx = await requireAdmin()
  } catch (e) {
    if (e instanceof NotAdminError) return { ok: false, error: 'Non autorizzato' }
    throw e
  }
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identificativo non valido' }

  const parsed = parsePersonInput(formData)
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.errors }

  const { data, error } = await ctx.supabase
    .from('people')
    .update(parsed.data)
    .eq('id', id)
    .select('slug')
    .maybeSingle()
  if (error) return { ok: false, error: 'Salvataggio non riuscito. Riprova.' }
  if (!data) return { ok: false, error: 'Persona non trovata o permessi insufficienti' }

  updateTag('people')
  revalidatePath('/')
  revalidatePath('/attori')
  revalidatePath(`/attori/${data.slug}`)
  revalidatePath('/spettacoli/[slug]', 'page')
  revalidatePath('/archivio')
  return { ok: true }
}

export async function updateDate(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  let ctx
  try {
    ctx = await requireAdmin()
  } catch (e) {
    if (e instanceof NotAdminError) return { ok: false, error: 'Non autorizzato' }
    throw e
  }
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identificativo non valido' }

  const parsed = parseDateInput(formData)
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.errors }

  const { data, error } = await ctx.supabase
    .from('dates')
    .update(parsed.data)
    .eq('id', id)
    .select('id')
    .maybeSingle()
  if (error) return { ok: false, error: 'Salvataggio non riuscito. Riprova.' }
  if (!data) return { ok: false, error: 'Data non trovata o permessi insufficienti' }

  updateTag('dates')
  revalidatePath('/')
  revalidatePath('/spettacoli')
  revalidatePath('/spettacoli/[slug]', 'page')
  revalidatePath('/archivio')
  revalidatePath('/attori', 'layout')
  return { ok: true }
}

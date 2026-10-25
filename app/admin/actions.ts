'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotAdminError, parseAdminEmails, requireAdmin } from '@/lib/admin/requireAdmin'
import {
  parseDateInput,
  parsePerformancePersonInput,
  parsePersonInput,
  parsePlayInput,
  parseProductionInput,
  type FieldErrors,
  type ParseResult,
} from '@/lib/admin/validation'

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

type AdminTable = 'people' | 'dates' | 'plays' | 'productions' | 'performance_people'

// The generated client types are per-table, so the shared helper uses this narrow shape instead.
interface UpdateBuilder {
  update(values: object): {
    eq(column: 'id', value: string): {
      select(columns: string): {
        maybeSingle(): PromiseLike<{ data: unknown; error: unknown }>
      }
    }
  }
}

interface UpdateSpec {
  table: AdminTable
  notFound: string
  parse: (form: FormData) => ParseResult<object>
  // Columns read back from the updated row, to build revalidation paths.
  returning: string
  revalidate: (row: Record<string, string>) => void
}

// Shared by every update action: admin check, id and input validation, update through the
// session client (RLS is the real boundary), then revalidation. Never leaks raw database errors.
async function runUpdate(spec: UpdateSpec, id: string, formData: FormData): Promise<ActionState> {
  let ctx
  try {
    ctx = await requireAdmin()
  } catch (e) {
    if (e instanceof NotAdminError) return { ok: false, error: 'Non autorizzato' }
    throw e
  }
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identificativo non valido' }

  const parsed = spec.parse(formData)
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.errors }

  const { data, error } = await (ctx.supabase.from(spec.table) as unknown as UpdateBuilder)
    .update(parsed.data)
    .eq('id', id)
    .select(spec.returning)
    .maybeSingle()
  if (error) return { ok: false, error: 'Salvataggio non riuscito. Riprova.' }
  if (!data) return { ok: false, error: spec.notFound }

  spec.revalidate(data as Record<string, string>)
  return { ok: true }
}

export async function updatePerson(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runUpdate(
    {
      table: 'people',
      notFound: 'Persona non trovata o permessi insufficienti',
      parse: parsePersonInput,
      returning: 'slug',
      revalidate: (row) => {
        updateTag('people')
        revalidatePath('/')
        revalidatePath('/attori')
        revalidatePath(`/attori/${row.slug}`)
        revalidatePath('/spettacoli/[slug]', 'page')
        revalidatePath('/archivio')
      },
    },
    id,
    formData
  )
}

export async function updateDate(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runUpdate(
    {
      table: 'dates',
      notFound: 'Data non trovata o permessi insufficienti',
      parse: parseDateInput,
      returning: 'id',
      revalidate: () => {
        updateTag('dates')
        revalidatePublicShowPages()
      },
    },
    id,
    formData
  )
}

export async function updatePlay(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runUpdate(
    {
      table: 'plays',
      notFound: 'Spettacolo non trovato o permessi insufficienti',
      parse: parsePlayInput,
      returning: 'slug',
      revalidate: () => {
        revalidatePublicShowPages()
        revalidatePath('/media')
      },
    },
    id,
    formData
  )
}

export async function updateProduction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runUpdate(
    {
      table: 'productions',
      notFound: 'Produzione non trovata o permessi insufficienti',
      parse: parseProductionInput,
      returning: 'id',
      revalidate: () => {
        updateTag('dates')
        revalidatePublicShowPages()
      },
    },
    id,
    formData
  )
}

export async function updatePerformancePerson(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runUpdate(
    {
      table: 'performance_people',
      notFound: 'Voce non trovata o permessi insufficienti',
      parse: parsePerformancePersonInput,
      returning: 'id',
      revalidate: () => {
        updateTag('people')
        updateTag('dates')
        revalidatePublicShowPages()
        revalidatePath('/attori/[slug]', 'page')
      },
    },
    id,
    formData
  )
}

function revalidatePublicShowPages() {
  revalidatePath('/')
  revalidatePath('/spettacoli')
  revalidatePath('/spettacoli/[slug]', 'page')
  revalidatePath('/archivio')
  revalidatePath('/attori', 'layout')
}

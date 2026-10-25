'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotAdminError, parseAdminEmails, requireAdmin } from '@/lib/admin/requireAdmin'
import { slugify, uniqueSlug } from '@/lib/admin/slug'
import { castRowsToCopy, type CastRow } from '@/lib/admin/castCopy'
import {
  isUuid,
  parseDateInput,
  parseNewCastEntryInput,
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

async function authorize(): Promise<{ ok: true; ctx: Awaited<ReturnType<typeof requireAdmin>> } | { ok: false; state: ActionState }> {
  try {
    return { ok: true, ctx: await requireAdmin() }
  } catch (e) {
    if (e instanceof NotAdminError) return { ok: false, state: { ok: false, error: 'Non autorizzato' } }
    throw e
  }
}

// Shared by every update action: admin check, id and input validation, update through the
// session client (RLS is the real boundary), then revalidation. Never leaks raw database errors.
async function runUpdate(spec: UpdateSpec, id: string, formData: FormData): Promise<ActionState> {
  const auth = await authorize()
  if (!auth.ok) return auth.state
  const { ctx } = auth
  if (!isUuid(id)) return { ok: false, error: 'Identificativo non valido' }

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

function revalidatePeoplePages() {
  updateTag('people')
  revalidatePath('/')
  revalidatePath('/attori')
  revalidatePath('/attori/[slug]', 'page')
  revalidatePath('/spettacoli/[slug]', 'page')
  revalidatePath('/archivio')
  revalidatePath('/sitemap.xml')
}

function revalidatePlayPages() {
  revalidatePublicShowPages()
  revalidatePath('/media')
  revalidatePath('/sitemap.xml')
}

function revalidatePublicShowPages() {
  revalidatePath('/')
  revalidatePath('/spettacoli')
  revalidatePath('/spettacoli/[slug]', 'page')
  revalidatePath('/archivio')
  revalidatePath('/attori', 'layout')
}

// ---------------------------------------------------------------------------
// Create and delete (increment 3)
// ---------------------------------------------------------------------------

interface InsertBuilder {
  insert(values: object): {
    select(columns: string): {
      maybeSingle(): PromiseLike<{ data: unknown; error: { code?: string } | null }>
    }
  }
}

interface InsertSpec {
  table: AdminTable
  parse: (form: FormData) => ParseResult<object>
  // Extra columns (parent id, generated slug) merged into the parsed input.
  extra?: (parsed: object, supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase']) => Promise<object>
  revalidate: () => void
  redirectTo: (id: string) => string
}

const DUPLICATE_KEY = '23505'

// Mirrors runUpdate: admin check, input validation, insert through the session client (RLS is the
// real boundary), revalidation, then redirect to the page of the new row.
async function runInsert(spec: InsertSpec, formData: FormData): Promise<ActionState> {
  const auth = await authorize()
  if (!auth.ok) return auth.state
  const { supabase } = auth.ctx

  const parsed = spec.parse(formData)
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.errors }

  const values = { ...parsed.data, ...(spec.extra ? await spec.extra(parsed.data, supabase) : {}) }
  const { data, error } = await (supabase.from(spec.table) as unknown as InsertBuilder)
    .insert(values)
    .select('id')
    .maybeSingle()
  if (error?.code === DUPLICATE_KEY) return { ok: false, error: 'Esiste già una voce uguale.' }
  if (error) return { ok: false, error: 'Creazione non riuscita. Riprova.' }
  const row = data as { id?: string } | null
  if (!row?.id) return { ok: false, error: 'Creazione non riuscita: permessi insufficienti' }

  spec.revalidate()
  redirect(spec.redirectTo(row.id))
}

// `base`, `base_2`, ... computed from the slugs already used with the same prefix.
async function generateSlug(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  table: 'people' | 'plays',
  source: string
): Promise<string> {
  const base = slugify(source) || 'senza_nome'
  const { data } = await supabase.from(table).select('slug').like('slug', `${base}%`)
  return uniqueSlug(base, (data ?? []).map((r) => r.slug))
}

export async function createPerson(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runInsert(
    {
      table: 'people',
      parse: parsePersonInput,
      extra: async (parsed, supabase) => ({ slug: await generateSlug(supabase, 'people', (parsed as { name: string }).name) }),
      revalidate: revalidatePeoplePages,
      redirectTo: (id) => `/admin/people/${id}`,
    },
    formData
  )
}

export async function createPlay(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runInsert(
    {
      table: 'plays',
      parse: parsePlayInput,
      extra: async (parsed, supabase) => ({ slug: await generateSlug(supabase, 'plays', (parsed as { title: string }).title) }),
      revalidate: revalidatePlayPages,
      redirectTo: (id) => `/admin/plays/${id}`,
    },
    formData
  )
}

export async function createProduction(playId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isUuid(playId)) return { ok: false, error: 'Identificativo non valido' }
  return runInsert(
    {
      table: 'productions',
      parse: parseProductionInput,
      extra: async () => ({ play_id: playId }),
      revalidate: revalidatePlayPages,
      redirectTo: (id) => `/admin/productions/${id}`,
    },
    formData
  )
}

export async function createDate(productionId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isUuid(productionId)) return { ok: false, error: 'Identificativo non valido' }
  return runInsert(
    {
      table: 'dates',
      parse: parseDateInput,
      extra: async () => ({ production_id: productionId }),
      revalidate: () => {
        updateTag('dates')
        revalidatePublicShowPages()
      },
      redirectTo: (id) => `/admin/dates/${id}`,
    },
    formData
  )
}

export async function createCastEntry(dateId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isUuid(dateId)) return { ok: false, error: 'Identificativo non valido' }
  return runInsert(
    {
      table: 'performance_people',
      parse: parseNewCastEntryInput,
      extra: async () => ({ date_id: dateId }),
      revalidate: revalidateCastPages,
      redirectTo: () => `/admin/dates/${dateId}/cast`,
    },
    formData
  )
}

interface BulkInsertBuilder {
  insert(values: object[]): { select(columns: string): PromiseLike<{ data: unknown; error: unknown }> }
}

const CAST_COLUMNS = 'person_id, role, character_name, sort_order, costume_url, notes'

// Copies the cast of another date onto this one, skipping entries that are already there.
// One bulk insert, so it either copies everything or nothing.
export async function copyCastFromDate(targetDateId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await authorize()
  if (!auth.ok) return auth.state
  const { supabase } = auth.ctx

  const sourceDateId = String(formData.get('source_date_id') ?? '').trim()
  if (!isUuid(targetDateId)) return { ok: false, error: 'Identificativo non valido' }
  if (!sourceDateId) return { ok: false, fieldErrors: { source_date_id: 'Scegli la data da cui copiare' } }
  if (!isUuid(sourceDateId)) return { ok: false, fieldErrors: { source_date_id: 'Data non valida' } }
  if (sourceDateId === targetDateId) return { ok: false, fieldErrors: { source_date_id: 'Scegli un\'altra data' } }

  const [source, existing] = await Promise.all([
    supabase.from('performance_people').select(CAST_COLUMNS).eq('date_id', sourceDateId),
    supabase.from('performance_people').select(CAST_COLUMNS).eq('date_id', targetDateId),
  ])
  if (source.error || existing.error) return { ok: false, error: 'Copia non riuscita. Riprova.' }

  const sourceRows = (source.data ?? []) as CastRow[]
  if (sourceRows.length === 0) return { ok: false, error: 'La data scelta non ha cast da copiare.' }

  const rows = castRowsToCopy(sourceRows, (existing.data ?? []) as CastRow[], targetDateId)
  if (rows.length === 0) return { ok: false, error: 'Tutte le voci di quella data sono già presenti.' }

  const { data, error } = await (supabase.from('performance_people') as unknown as BulkInsertBuilder)
    .insert(rows)
    .select('id')
  if (error) return { ok: false, error: 'Copia non riuscita. Riprova.' }
  // RLS denial inserts nothing and returns no rows
  if (!Array.isArray(data) || data.length !== rows.length) return { ok: false, error: 'Copia non riuscita: permessi insufficienti' }

  revalidateCastPages()
  redirect(`/admin/dates/${targetDateId}/cast`)
}

function revalidateCastPages() {
  updateTag('people')
  updateTag('dates')
  revalidatePublicShowPages()
  revalidatePath('/attori/[slug]', 'page')
}

interface DeleteBuilder {
  delete(): {
    eq(column: 'id', value: string): {
      select(columns: string): {
        maybeSingle(): PromiseLike<{ data: unknown; error: { code?: string } | null }>
      }
    }
  }
}

interface CountBuilder {
  select(
    columns: string,
    options: { count: 'exact'; head: true }
  ): { eq(column: string, value: string): PromiseLike<{ count: number | null; error: unknown }> }
}

interface DeleteSpec {
  table: AdminTable
  notFound: string
  // Rows in other tables that point at this one. Deleting is blocked while any exist,
  // so a delete never relies on the database cascade rules.
  blockers: { table: AdminTable; column: string; message: (count: number) => string }[]
  revalidate: () => void
  redirectTo: (id: string) => string
}

async function runDelete(spec: DeleteSpec, id: string): Promise<ActionState> {
  const auth = await authorize()
  if (!auth.ok) return auth.state
  const { supabase } = auth.ctx
  if (!isUuid(id)) return { ok: false, error: 'Identificativo non valido' }

  for (const b of spec.blockers) {
    const { count, error } = await (supabase.from(b.table) as unknown as CountBuilder)
      .select('id', { count: 'exact', head: true })
      .eq(b.column, id)
    if (error) return { ok: false, error: 'Eliminazione non riuscita. Riprova.' }
    if (count && count > 0) return { ok: false, error: b.message(count) }
  }

  const { data, error } = await (supabase.from(spec.table) as unknown as DeleteBuilder)
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()
  if (error) return { ok: false, error: 'Eliminazione non riuscita. Riprova.' }
  if (!data) return { ok: false, error: spec.notFound }

  spec.revalidate()
  redirect(spec.redirectTo(id))
}

export async function deletePerson(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  return runDelete(
    {
      table: 'people',
      notFound: 'Persona non trovata o permessi insufficienti',
      blockers: [
        {
          table: 'performance_people',
          column: 'person_id',
          message: (n) => `Questa persona compare in ${n} ${n === 1 ? 'voce' : 'voci'} di cast: eliminale prima.`,
        },
      ],
      revalidate: revalidatePeoplePages,
      redirectTo: () => '/admin/people',
    },
    id
  )
}

export async function deletePlay(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  return runDelete(
    {
      table: 'plays',
      notFound: 'Spettacolo non trovato o permessi insufficienti',
      blockers: [
        {
          table: 'productions',
          column: 'play_id',
          message: (n) => `Questo spettacolo ha ${n} ${n === 1 ? 'produzione' : 'produzioni'}: eliminale prima.`,
        },
      ],
      revalidate: revalidatePlayPages,
      redirectTo: () => '/admin/plays',
    },
    id
  )
}

export async function deleteProduction(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  return runDelete(
    {
      table: 'productions',
      notFound: 'Produzione non trovata o permessi insufficienti',
      blockers: [
        {
          table: 'dates',
          column: 'production_id',
          message: (n) => `Questa produzione ha ${n} ${n === 1 ? 'data' : 'date'}: eliminale prima.`,
        },
      ],
      revalidate: revalidatePlayPages,
      redirectTo: () => '/admin/plays',
    },
    id
  )
}

export async function deleteDate(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  return runDelete(
    {
      table: 'dates',
      notFound: 'Data non trovata o permessi insufficienti',
      blockers: [
        {
          table: 'performance_people',
          column: 'date_id',
          message: (n) => `Questa data ha ${n} ${n === 1 ? 'voce' : 'voci'} di cast: eliminale prima.`,
        },
      ],
      revalidate: () => {
        updateTag('dates')
        revalidatePublicShowPages()
      },
      redirectTo: () => '/admin/dates',
    },
    id
  )
}

// Cast entries have no dependents, so they can always be deleted. The date id is bound
// only to return to the right cast list.
export async function deleteCastEntry(dateId: string, id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  if (!isUuid(dateId)) return { ok: false, error: 'Identificativo non valido' }
  return runDelete(
    {
      table: 'performance_people',
      notFound: 'Voce non trovata o permessi insufficienti',
      blockers: [],
      revalidate: revalidateCastPages,
      redirectTo: () => `/admin/dates/${dateId}/cast`,
    },
    id
  )
}

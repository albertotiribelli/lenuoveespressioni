// lib/admin/validation.ts — parse and validate admin form input (FormData -> typed update payload)

export type FieldErrors = Record<string, string>
export type ParseResult<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors }

export interface PersonInput {
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  joined_at: string
  is_active: boolean
}

export interface DateInput {
  date: string
  time: string | null
  theater_name: string
  city: string | null
  notes: string | null
  tickets_url: string | null
  gphotos_url: string | null
}

export interface PlayInput {
  title: string
  short_desc: string | null
  description: string | null
  poster_url: string | null
  trailer_url: string | null
  youtube_url: string | null
}

export interface ProductionInput {
  season_year: string
  notes: string | null
}

export const PERFORMANCE_ROLES = ['actor', 'director', 'technician', 'other'] as const

export interface PerformancePersonInput {
  role: (typeof PERFORMANCE_ROLES)[number]
  character_name: string | null
  sort_order: number | null
  costume_url: string | null
  notes: string | null
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/

function text(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function required(form: FormData, key: string, errors: FieldErrors, label: string): string {
  const v = text(form, key)
  if (!v) errors[key] = `${label} è obbligatorio`
  return v
}

// dates.tickets_url also accepts the sentinel 'coming-soon' (shows "Biglietti disponibili a breve")
export const TICKETS_COMING_SOON = 'coming-soon'

function optionalUrl(form: FormData, key: string, errors: FieldErrors, allowed: string[] = []): string | null {
  const v = text(form, key)
  if (!v) return null
  if (!allowed.includes(v) && !isHttpUrl(v)) errors[key] = 'Inserisci un URL valido (http o https)'
  return v
}

export function parsePersonInput(form: FormData): ParseResult<PersonInput> {
  const errors: FieldErrors = {}
  const name = required(form, 'name', errors, 'Il nome')
  const role = required(form, 'role', errors, 'Il ruolo')
  const joined_at = text(form, 'joined_at')
  if (!joined_at) errors.joined_at = "La data di ingresso è obbligatoria"
  else if (!isValidDate(joined_at)) errors.joined_at = 'Data non valida'

  const photo_url = optionalUrl(form, 'photo_url', errors)
  const bio = text(form, 'bio') || null

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, data: { name, role, bio, photo_url, joined_at, is_active: form.get('is_active') === 'on' } }
}

export function parseDateInput(form: FormData): ParseResult<DateInput> {
  const errors: FieldErrors = {}
  const date = text(form, 'date')
  if (!date) errors.date = 'La data è obbligatoria'
  else if (!isValidDate(date)) errors.date = 'Data non valida'

  const time = text(form, 'time') || null
  if (time && !TIME_RE.test(time)) errors.time = 'Orario non valido (HH:MM)'

  const theater_name = required(form, 'theater_name', errors, 'Il teatro')
  const tickets_url = optionalUrl(form, 'tickets_url', errors, [TICKETS_COMING_SOON])
  const gphotos_url = optionalUrl(form, 'gphotos_url', errors)

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      date,
      time,
      theater_name,
      city: text(form, 'city') || null,
      notes: text(form, 'notes') || null,
      tickets_url,
      gphotos_url,
    },
  }
}

export function parsePlayInput(form: FormData): ParseResult<PlayInput> {
  const errors: FieldErrors = {}
  const title = required(form, 'title', errors, 'Il titolo')
  const poster_url = optionalUrl(form, 'poster_url', errors)
  const trailer_url = optionalUrl(form, 'trailer_url', errors)
  const youtube_url = optionalUrl(form, 'youtube_url', errors)

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      title,
      short_desc: text(form, 'short_desc') || null,
      description: text(form, 'description') || null,
      poster_url,
      trailer_url,
      youtube_url,
    },
  }
}

export function parseProductionInput(form: FormData): ParseResult<ProductionInput> {
  const errors: FieldErrors = {}
  const season_year = required(form, 'season_year', errors, "L'anno di stagione")

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, data: { season_year, notes: text(form, 'notes') || null } }
}

export function parsePerformancePersonInput(form: FormData): ParseResult<PerformancePersonInput> {
  const errors: FieldErrors = {}
  const role = text(form, 'role') as PerformancePersonInput['role']
  if (!role) errors.role = 'Il ruolo è obbligatorio'
  else if (!PERFORMANCE_ROLES.includes(role)) errors.role = 'Ruolo non valido'

  const rawOrder = text(form, 'sort_order')
  let sort_order: number | null = null
  if (rawOrder) {
    if (!/^\d{1,4}$/.test(rawOrder)) errors.sort_order = "L'ordine deve essere un numero intero (0 o più)"
    else sort_order = Number(rawOrder)
  }

  // costume_url holds '' in some existing rows: empty becomes null
  const costume_url = optionalUrl(form, 'costume_url', errors)

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      role,
      character_name: text(form, 'character_name') || null,
      sort_order,
      costume_url,
      notes: text(form, 'notes') || null,
    },
  }
}

export interface NewCastEntryInput extends PerformancePersonInput {
  person_id: string
}

export function parseNewCastEntryInput(form: FormData): ParseResult<NewCastEntryInput> {
  const base = parsePerformancePersonInput(form)
  const errors: FieldErrors = base.ok ? {} : { ...base.errors }
  const person_id = text(form, 'person_id')
  if (!person_id) errors.person_id = 'Scegli una persona'
  else if (!isUuid(person_id)) errors.person_id = 'Persona non valida'

  if (Object.keys(errors).length || !base.ok) return { ok: false, errors }
  return { ok: true, data: { ...base.data, person_id } }
}

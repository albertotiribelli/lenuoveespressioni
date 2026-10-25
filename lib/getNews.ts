import { supabase } from './supabase'

// Postgres "undefined_table" and PostgREST "table not in schema cache": the news table has not been
// created yet. The public site treats that as "no news" instead of failing.
const MISSING_TABLE = new Set(['42P01', 'PGRST205'])

function isMissingTable(error: { code?: string }): boolean {
  return !!error.code && MISSING_TABLE.has(error.code)
}

const LIST_COLUMNS = 'id, slug, title, body, published_at, plays(slug, title)'

export async function getNewsList() {
  const { data, error } = await supabase
    .from('news')
    .select(LIST_COLUMNS)
    .order('published_at', { ascending: false })
  if (error) {
    if (isMissingTable(error)) return []
    throw error
  }
  return data ?? []
}

export async function getNewsSlugs() {
  const { data, error } = await supabase.from('news').select('slug')
  if (error) {
    if (isMissingTable(error)) return []
    throw error
  }
  return data ?? []
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from('news')
    .select(LIST_COLUMNS)
    .eq('slug', slug)
    .maybeSingle()
  if (error) {
    if (isMissingTable(error)) return null
    throw error
  }
  return data
}

export async function getNewsForPlay(playId: string) {
  const { data, error } = await supabase
    .from('news')
    .select('id, slug, title, body, published_at')
    .eq('play_id', playId)
    .order('published_at', { ascending: false })
  if (error) {
    if (isMissingTable(error)) return []
    throw error
  }
  return data ?? []
}

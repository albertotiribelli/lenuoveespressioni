import { supabase } from './supabase'

export async function getPlayMeta(slug: string) {
  const { data, error } = await supabase
    .from('plays')
    .select('title, description, short_desc, poster_url')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getPlays() {
  const { data, error } = await supabase
    .from('plays')
    .select('id, slug, title, short_desc, poster_url, trailer_url, youtube_url')
    .order('title', { ascending: true })

  if (error) throw error
  return data
}

export async function getPlayBySlug(slug: string) {
  const { data, error } = await supabase
    .from('plays')
    .select(`
      id,
      slug,
      title,
      description,
      short_desc,
      poster_url,
      trailer_url,
      youtube_url,
      productions (
        id,
        season_year,
        notes,
        dates (
          id,
          date,
          time,
          theater_name,
          city,
          gphotos_url,
          notes,
          tickets_url,
          performance_people (
            character_name,
            role,
            sort_order,
            people (
              id,
              slug,
              name,
              photo_url
            )
          )
        )
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

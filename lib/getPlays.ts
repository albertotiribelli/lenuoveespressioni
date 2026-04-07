import { supabase } from './supabase'

export async function getPlays() {
  const { data, error } = await supabase
    .from('plays')
    .select('id, slug, title, short_desc, poster_url, youtube_url')
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
          performance_people (
            character_name,
            role,
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

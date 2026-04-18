import { supabase } from './supabase'

export async function getPeople() {
  const { data, error } = await supabase
    .from('people')
    .select('id, slug, name, role, bio, photo_url, joined_at, is_active')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getActivePeople() {
  const { data, error } = await supabase
    .from('people')
    .select('id, slug, name, role, bio, photo_url, joined_at, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getPersonBySlug(slug: string) {
  const { data, error } = await supabase
    .from('people')
    .select(`
      id,
      slug,
      name,
      role,
      bio,
      photo_url,
      joined_at,
      is_active,
      performance_people (
        character_name,
        role,
        notes,
        dates (
          date,
          theater_name,
          city,
          productions (
            season_year,
            plays (
              title,
              slug
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

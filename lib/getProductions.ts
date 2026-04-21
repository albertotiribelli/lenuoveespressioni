import { supabase } from './supabase'

export async function getAllProductions() {
  const { data, error } = await supabase
    .from('productions')
    .select(`
      id,
      season_year,
      notes,
      plays (
        title,
        slug,
        poster_url,
        short_desc
      ),
      dates (
        id,
        date,
        time,
        theater_name,
        city,
        notes
      )
    `)
    .order('season_year', { ascending: false })

  if (error) throw error
  return data
}

export async function getProductionsByPlay(playId: string) {
  const { data, error } = await supabase
    .from('productions')
    .select(`
      id,
      season_year,
      notes,
      dates (
        id,
        date,
        time,
        theater_name,
        city,
        performance_people (
          character_name,
          role,
          people (
            id,
            slug,
            name
          )
        )
      )
    `)
    .eq('play_id', playId)
    .order('season_year', { ascending: false })

  if (error) throw error
  return data
}

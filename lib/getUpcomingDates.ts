// lib/getUpcomingDates.ts  ← first function we build
import { supabase } from './supabase'

export async function getUpcomingDates() {
  const { data, error } = await supabase
    .from('dates')
    .select(`
      id,
      date,
      time,
      theater_name,
      city,
      notes,
      productions (
        season_year,
        plays (
          title,
          slug,
          poster_url,
          short_desc
        )
      )
    `)
    .gte('date', new Date().toISOString())   // from today forward
    .order('date', { ascending: true })
    .limit(10)

  if (error) throw error
  return data
}
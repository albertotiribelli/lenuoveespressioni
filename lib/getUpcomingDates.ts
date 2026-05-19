import { supabase } from './supabase'

export async function getUpcomingDates() {
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const from = twoWeeksAgo.toISOString().slice(0, 10)

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
    .gte('date', from)
    .order('date', { ascending: true })
    .limit(20)

  if (error) throw error
  return data
}

// types/index.ts — domain types derived from the DB schema

export interface Play {
  id: string
  title: string
  slug: string
  short_desc: string | null
  description: string | null
  poster_url: string | null
  trailer_url: string | null
  youtube_url: string | null
  created_at: string | null
}

export interface Person {
  id: string
  name: string
  slug: string
  role: string
  bio: string | null
  photo_url: string | null
  joined_at: string
  is_active: boolean | null
  personal_data: Record<string, unknown> | null
  created_at: string | null
}

export interface Production {
  id: string
  play_id: string | null
  season_year: string
  notes: string | null
  created_at: string | null
}

export interface PerformanceDate {
  id: string
  production_id: string | null
  date: string
  time: string | null
  theater_name: string
  city: string | null
  gphotos_url: string | null
  notes: string | null
  tickets_url: string | null
  created_at: string | null
}

export interface CastEntry {
  id: string
  date_id: string | null
  person_id: string | null
  role: string
  character_name: string | null
  notes: string | null
}

// Shape returned by getUpcomingDates — nested join result
export interface UpcomingDate {
  id: string
  date: string
  time: string | null
  theater_name: string
  city: string | null
  notes: string | null
  tickets_url: string | null
  productions: {
    season_year: string
    plays: {
      title: string
      slug: string
      poster_url: string | null
      short_desc: string | null
    } | null
  } | null
}

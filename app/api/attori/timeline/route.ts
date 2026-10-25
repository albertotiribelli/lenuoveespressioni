import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getPeopleTimeline } from '@/lib/getPeople'
import { buildMembershipTimeline } from '@/lib/membershipTimeline'

// Data of the hidden company history (/attori?edespressionisimili). Fetched by the browser only when
// that flag is present, so regular /attori visits stay fully static.
const getTimeline = unstable_cache(async () => buildMembershipTimeline(await getPeopleTimeline()), ['people-timeline-data'], {
  revalidate: 3600,
  tags: ['people', 'dates'],
})

export async function GET() {
  try {
    return NextResponse.json(await getTimeline(), {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 })
  }
}

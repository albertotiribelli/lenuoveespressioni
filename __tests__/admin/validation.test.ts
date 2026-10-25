import {
  parseDateInput,
  parseNewCastEntryInput,
  parsePerformancePersonInput,
  parsePersonInput,
  parsePlayInput,
  parseProductionInput,
} from '@/lib/admin/validation'

function form(entries: Record<string, string>) {
  const f = new FormData()
  Object.entries(entries).forEach(([k, v]) => f.set(k, v))
  return f
}

describe('parsePersonInput', () => {
  const valid = { name: ' Mario Rossi ', role: 'actor', joined_at: '2015-03-01', bio: '', photo_url: '' }

  it('trims strings, turns empty optionals into null and reads the checkbox', () => {
    const r = parsePersonInput(form({ ...valid, is_active: 'on' }))
    expect(r).toEqual({
      ok: true,
      data: { name: 'Mario Rossi', role: 'actor', bio: null, photo_url: null, joined_at: '2015-03-01', is_active: true },
    })
  })

  it('treats a missing checkbox as inactive', () => {
    const r = parsePersonInput(form(valid))
    expect(r.ok && r.data.is_active).toBe(false)
  })

  it('requires name, role and joined_at', () => {
    const r = parsePersonInput(form({}))
    expect(r).toMatchObject({ ok: false, errors: { name: expect.any(String), role: expect.any(String), joined_at: expect.any(String) } })
  })

  it('rejects impossible dates and non-http URLs', () => {
    const r = parsePersonInput(form({ ...valid, joined_at: '2015-02-31', photo_url: 'javascript:alert(1)' }))
    expect(r).toMatchObject({ ok: false, errors: { joined_at: expect.any(String), photo_url: expect.any(String) } })
  })
})

describe('parseDateInput', () => {
  const valid = { date: '2026-10-24', theater_name: 'Teatro Sociale', time: '21:00', city: '', notes: '', tickets_url: '', gphotos_url: '' }

  it('accepts a valid payload', () => {
    expect(parseDateInput(form(valid))).toEqual({
      ok: true,
      data: { date: '2026-10-24', time: '21:00', theater_name: 'Teatro Sociale', city: null, notes: null, tickets_url: null, gphotos_url: null },
    })
  })

  it('accepts HH:MM:SS and an empty time', () => {
    expect(parseDateInput(form({ ...valid, time: '21:00:00' })).ok).toBe(true)
    const r = parseDateInput(form({ ...valid, time: '' }))
    expect(r.ok && r.data.time).toBeNull()
  })

  it("accepts the 'coming-soon' sentinel for tickets_url only", () => {
    const ok = parseDateInput(form({ ...valid, tickets_url: 'coming-soon' }))
    expect(ok.ok && ok.data.tickets_url).toBe('coming-soon')
    const bad = parseDateInput(form({ ...valid, gphotos_url: 'coming-soon' }))
    expect(bad).toMatchObject({ ok: false, errors: { gphotos_url: expect.any(String) } })
  })

  it('rejects a bad time, bad URL and missing required fields', () => {
    const r = parseDateInput(form({ ...valid, time: '25:99', tickets_url: 'not a url', theater_name: ' ' }))
    expect(r).toMatchObject({ ok: false, errors: { time: expect.any(String), tickets_url: expect.any(String), theater_name: expect.any(String) } })
  })
})

describe('parsePlayInput', () => {
  const valid = { title: ' Hercules ', short_desc: '', description: '', poster_url: '', trailer_url: '', youtube_url: '' }

  it('trims, requires the title and turns empty optionals into null', () => {
    expect(parsePlayInput(form(valid))).toEqual({
      ok: true,
      data: { title: 'Hercules', short_desc: null, description: null, poster_url: null, trailer_url: null, youtube_url: null },
    })
    expect(parsePlayInput(form({}))).toMatchObject({ ok: false, errors: { title: expect.any(String) } })
  })

  it('rejects non-http URLs in every URL column, including coming-soon', () => {
    const r = parsePlayInput(
      form({ ...valid, poster_url: 'javascript:alert(1)', trailer_url: 'coming-soon', youtube_url: 'youtube.com/x' })
    )
    expect(r).toMatchObject({
      ok: false,
      errors: { poster_url: expect.any(String), trailer_url: expect.any(String), youtube_url: expect.any(String) },
    })
  })

  it('accepts real YouTube and Cloudinary URLs', () => {
    const r = parsePlayInput(
      form({ ...valid, trailer_url: 'https://youtu.be/lc3Fe_YLamY?si=abc', poster_url: 'https://res.cloudinary.com/x/image/upload/w_800,h_1200/a' })
    )
    expect(r.ok).toBe(true)
  })
})

describe('parseProductionInput', () => {
  it('requires the season and nulls empty notes', () => {
    expect(parseProductionInput(form({ season_year: ' 2019/2020 ', notes: '' }))).toEqual({
      ok: true,
      data: { season_year: '2019/2020', notes: null },
    })
    expect(parseProductionInput(form({ season_year: ' ' }))).toMatchObject({ ok: false, errors: { season_year: expect.any(String) } })
  })
})

describe('parsePerformancePersonInput', () => {
  const valid = { role: 'actor', character_name: ' Ercole ', sort_order: '3', costume_url: '', notes: '' }

  it('parses a valid entry, with sort_order as a number', () => {
    expect(parsePerformancePersonInput(form(valid))).toEqual({
      ok: true,
      data: { role: 'actor', character_name: 'Ercole', sort_order: 3, costume_url: null, notes: null },
    })
  })

  it('allows an empty sort_order and keeps 0', () => {
    expect(parsePerformancePersonInput(form({ ...valid, sort_order: '' }))).toMatchObject({ ok: true, data: { sort_order: null } })
    expect(parsePerformancePersonInput(form({ ...valid, sort_order: '0' }))).toMatchObject({ ok: true, data: { sort_order: 0 } })
  })

  it('rejects unknown roles, bad numbers and non-http costume URLs', () => {
    const r = parsePerformancePersonInput(form({ ...valid, role: 'wizard', sort_order: '-1', costume_url: 'ftp://x' }))
    expect(r).toMatchObject({
      ok: false,
      errors: { role: expect.any(String), sort_order: expect.any(String), costume_url: expect.any(String) },
    })
    expect(parsePerformancePersonInput(form({ ...valid, sort_order: '1.5' })).ok).toBe(false)
    expect(parsePerformancePersonInput(form({ ...valid, role: '' }))).toMatchObject({ ok: false, errors: { role: expect.any(String) } })
  })
})

describe('parseNewCastEntryInput', () => {
  const PID = '123e4567-e89b-12d3-a456-426614174000'
  const valid = { person_id: PID, role: 'actor', character_name: 'Ercole', sort_order: '1', costume_url: '', notes: '' }

  it('adds the person id to the cast fields', () => {
    expect(parseNewCastEntryInput(form(valid))).toEqual({
      ok: true,
      data: { person_id: PID, role: 'actor', character_name: 'Ercole', sort_order: 1, costume_url: null, notes: null },
    })
  })

  it('requires a valid person and still validates the other fields', () => {
    expect(parseNewCastEntryInput(form({ ...valid, person_id: '' }))).toMatchObject({ ok: false, errors: { person_id: expect.any(String) } })
    expect(parseNewCastEntryInput(form({ ...valid, person_id: 'nope' }))).toMatchObject({ ok: false, errors: { person_id: expect.any(String) } })
    expect(parseNewCastEntryInput(form({ ...valid, role: 'wizard' }))).toMatchObject({ ok: false, errors: { role: expect.any(String) } })
  })
})

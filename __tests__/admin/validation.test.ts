import { parseDateInput, parsePersonInput } from '@/lib/admin/validation'

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

/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('next/dynamic', () => () =>
  function MockTimeline({ people }: { people: unknown[] }) {
    return <div>Timeline con {people.length} persone</div>
  }
)

import CompanyHistory from '@/components/person/CompanyHistory'

const FLAG = '?edespressionisimili'

function renderAt(search: string) {
  window.history.pushState({}, '', `/attori${search}`)
  return render(
    <CompanyHistory>
      <h1>Compagnia</h1>
    </CompanyHistory>
  )
}

afterEach(() => {
  jest.restoreAllMocks()
  window.history.pushState({}, '', '/')
})

describe('CompanyHistory', () => {
  it('shows the regular server-rendered view and never fetches without the flag', () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as never
    renderAt('')
    expect(screen.getByRole('heading', { name: 'Compagnia' })).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('ignores unrelated query parameters', () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as never
    renderAt('?foo=bar')
    expect(screen.getByRole('heading', { name: 'Compagnia' })).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('swaps in the company history when the flag is present', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ people: [{ id: '1' }, { id: '2' }], allYears: ['2020'] }),
    }) as never
    renderAt(FLAG)
    expect(await screen.findByText('Timeline con 2 persone')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Storia della Compagnia' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Compagnia' })).not.toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith('/api/attori/timeline')
  })

  it('falls back to the regular view when the data cannot be loaded', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 502 }) as never
    renderAt(FLAG)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Compagnia' })).toBeInTheDocument())
  })
})

/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import type { ActionState } from '@/app/admin/actions'

// Installed React is 18.3 (Next bundles its own React 19 at build time), so useActionState must be stubbed here.
let mockState: ActionState = { ok: false }
let mockPending = false
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: () => [mockState, '', mockPending],
}))
jest.mock('@/app/admin/actions', () => ({ updatePerson: jest.fn(), updateDate: jest.fn(), sendMagicLink: jest.fn() }))

import PersonForm from '@/components/admin/PersonForm'
import DateForm from '@/components/admin/DateForm'

const person = {
  id: 'p1',
  name: 'Mario Rossi',
  role: 'actor',
  bio: 'Una bio',
  photo_url: null,
  joined_at: '2015-03-01',
  is_active: true,
}
const date = {
  id: 'd1',
  date: '2026-10-24',
  time: '21:00:00',
  theater_name: 'Teatro Sociale',
  city: 'Milano',
  notes: null,
  tickets_url: null,
  gphotos_url: null,
}

beforeEach(() => {
  mockState = { ok: false }
  mockPending = false
})

describe('PersonForm', () => {
  it('renders the existing values', () => {
    render(<PersonForm person={person} />)
    expect(screen.getByLabelText(/Nome/)).toHaveValue('Mario Rossi')
    expect(screen.getByLabelText(/Biografia/)).toHaveValue('Una bio')
    expect(screen.getByLabelText(/Membro attivo/)).toBeChecked()
  })

  it('shows field errors', () => {
    mockState = { ok: false, fieldErrors: { photo_url: 'Inserisci un URL valido (http o https)' } }
    render(<PersonForm person={person} />)
    expect(screen.getByRole('alert')).toHaveTextContent('URL valido')
    expect(screen.getByLabelText(/URL foto/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables the save button while pending', () => {
    mockPending = true
    render(<PersonForm person={person} />)
    expect(screen.getByRole('button', { name: /Salvataggio/ })).toBeDisabled()
  })

  it('confirms a successful save', () => {
    mockState = { ok: true }
    render(<PersonForm person={person} />)
    expect(screen.getByRole('status')).toHaveTextContent('Salvato')
  })
})

describe('DateForm', () => {
  it('renders values, trimming seconds from the time', () => {
    render(<DateForm date={date} />)
    expect(screen.getByLabelText(/Teatro/)).toHaveValue('Teatro Sociale')
    expect(screen.getByLabelText(/Orario/)).toHaveValue('21:00')
    expect(screen.getByLabelText(/Link biglietti/)).toHaveValue('')
  })

  it('shows a server error', () => {
    mockState = { ok: false, error: 'Salvataggio non riuscito. Riprova.' }
    render(<DateForm date={date} />)
    expect(screen.getByRole('status')).toHaveTextContent('Salvataggio non riuscito')
  })
})

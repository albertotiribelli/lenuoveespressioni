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
jest.mock('@/app/admin/actions', () => ({
  updatePerson: jest.fn(),
  updateDate: jest.fn(),
  updatePlay: jest.fn(),
  updateProduction: jest.fn(),
  updatePerformancePerson: jest.fn(),
  sendMagicLink: jest.fn(),
}))

import PersonForm from '@/components/admin/PersonForm'
import DateForm from '@/components/admin/DateForm'
import PlayForm from '@/components/admin/PlayForm'
import ProductionForm from '@/components/admin/ProductionForm'
import PerformancePersonForm from '@/components/admin/PerformancePersonForm'

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

describe('PlayForm', () => {
  const play = {
    id: 'pl1',
    title: 'Hercules',
    short_desc: 'Breve',
    description: 'Lunga',
    poster_url: 'https://img.test/p.jpg',
    trailer_url: null,
    youtube_url: null,
  }

  it('renders the existing values', () => {
    render(<PlayForm play={play} />)
    expect(screen.getByLabelText(/Titolo/)).toHaveValue('Hercules')
    expect(screen.getByLabelText(/Descrizione breve/)).toHaveValue('Breve')
    expect(screen.getByLabelText(/URL locandina/)).toHaveValue('https://img.test/p.jpg')
    expect(screen.getByLabelText(/URL trailer/)).toHaveValue('')
  })

  it('shows field errors and disables save while pending', () => {
    mockState = { ok: false, fieldErrors: { trailer_url: 'Inserisci un URL valido (http o https)' } }
    mockPending = true
    render(<PlayForm play={play} />)
    expect(screen.getByLabelText(/URL trailer/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('button', { name: /Salvataggio/ })).toBeDisabled()
  })
})

describe('ProductionForm', () => {
  it('renders the existing values and confirms a save', () => {
    mockState = { ok: true }
    render(<ProductionForm production={{ id: 'pr1', season_year: '2019/2020', notes: 'Note' }} />)
    expect(screen.getByLabelText(/Stagione/)).toHaveValue('2019/2020')
    expect(screen.getByLabelText(/Note/)).toHaveValue('Note')
    expect(screen.getByRole('status')).toHaveTextContent('Salvato')
  })
})

describe('PerformancePersonForm', () => {
  const entry = { id: 'e1', role: 'actor', character_name: 'Ercole', sort_order: 1, costume_url: null, notes: null }

  it('renders the role as a select with the current value and the order as a number', () => {
    render(<PerformancePersonForm entry={entry} />)
    expect(screen.getByLabelText(/Ruolo/)).toHaveValue('actor')
    expect(screen.getByRole('option', { name: 'director' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Personaggio/)).toHaveValue('Ercole')
    expect(screen.getByLabelText(/Ordine/)).toHaveValue(1)
  })

  it('keeps an unexpected existing role selectable instead of silently changing it', () => {
    render(<PerformancePersonForm entry={{ ...entry, role: 'mascot' }} />)
    expect(screen.getByLabelText(/Ruolo/)).toHaveValue('mascot')
  })

  it('shows field errors', () => {
    mockState = { ok: false, fieldErrors: { sort_order: "L'ordine deve essere un numero intero (0 o più)" } }
    render(<PerformancePersonForm entry={entry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('numero intero')
  })
})

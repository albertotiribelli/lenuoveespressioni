/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import CompanyTimeline from '@/components/person/CompanyTimeline'

const history = [
  {
    character_name: 'Amleto',
    role: 'actor',
    notes: null,
    dates: {
      date: '2024-11-15',
      theater_name: 'Teatro Sociale',
      city: 'Milano',
      productions: { season_year: '2024', plays: { title: 'Amleto', slug: 'amleto' } },
    },
  },
  {
    character_name: 'Estragone',
    role: 'actor',
    notes: null,
    dates: {
      date: '2022-05-10',
      theater_name: 'Teatro Piccolo',
      city: 'Roma',
      productions: { season_year: '2022', plays: { title: 'Aspettando Godot', slug: 'aspettando-godot' } },
    },
  },
]

describe('CompanyTimeline', () => {
  it('renders play titles linked to /spettacoli/[slug]', () => {
    render(<CompanyTimeline history={history} />)
    const amletoLink = screen.getByText('Amleto').closest('a')
    expect(amletoLink).toHaveAttribute('href', '/spettacoli/amleto')
  })

  it('renders character names', () => {
    render(<CompanyTimeline history={history} />)
    expect(screen.getByText(/Estragone/)).toBeInTheDocument()
  })

  it('renders season years', () => {
    render(<CompanyTimeline history={history} />)
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('renders empty state when history is empty', () => {
    render(<CompanyTimeline history={[]} />)
    expect(screen.getByText(/nessuna partecipazione/i)).toBeInTheDocument()
  })
})

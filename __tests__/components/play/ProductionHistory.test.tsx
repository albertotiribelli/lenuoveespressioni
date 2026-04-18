/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductionHistory from '@/components/play/ProductionHistory'

const productions = [
  {
    id: 'p1',
    season_year: '2024',
    notes: null,
    dates: [
      { id: 'd1', date: '2024-11-15', time: '21:00:00', theater_name: 'Teatro Sociale', city: 'Milano' },
      { id: 'd2', date: '2024-11-22', time: '21:00:00', theater_name: 'Teatro Piccolo', city: 'Roma' },
    ],
  },
  {
    id: 'p2',
    season_year: '2022',
    notes: null,
    dates: [
      { id: 'd3', date: '2022-05-10', time: '20:30:00', theater_name: 'Teatro Antico', city: 'Torino' },
    ],
  },
]

describe('ProductionHistory', () => {
  it('renders each season year', () => {
    render(<ProductionHistory productions={productions} />)
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('renders theater names', () => {
    render(<ProductionHistory productions={productions} />)
    expect(screen.getByText(/Teatro Sociale/)).toBeInTheDocument()
    expect(screen.getByText(/Teatro Antico/)).toBeInTheDocument()
  })

  it('renders city names', () => {
    render(<ProductionHistory productions={productions} />)
    expect(screen.getByText(/Milano/)).toBeInTheDocument()
    expect(screen.getByText(/Torino/)).toBeInTheDocument()
  })

  it('shows date count per production', () => {
    render(<ProductionHistory productions={productions} />)
    expect(screen.getByText(/2 date/i)).toBeInTheDocument()
    expect(screen.getByText(/1 data/i)).toBeInTheDocument()
  })
})

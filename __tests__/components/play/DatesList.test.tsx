/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import DatesList from '@/components/play/DatesList'
import type { PerformanceDate } from '@/types'

const base: PerformanceDate = {
  id: 'd1',
  production_id: null,
  date: '2099-06-15',
  time: '21:00:00',
  theater_name: 'Teatro Sociale',
  city: 'Milano',
  gphotos_url: null,
  notes: null,
  created_at: null,
}

describe('DatesList', () => {
  it('renders theater name and city', () => {
    render(<DatesList dates={[base]} />)
    expect(screen.getByText(/Teatro Sociale/)).toBeInTheDocument()
    expect(screen.getByText(/Milano/)).toBeInTheDocument()
  })

  it('renders empty state when no dates', () => {
    render(<DatesList dates={[]} />)
    expect(screen.getByText(/nessuna data/i)).toBeInTheDocument()
  })

  it('shows notes when present', () => {
    render(<DatesList dates={[{ ...base, notes: 'Replica straordinaria' }]} />)
    expect(screen.getByText('Replica straordinaria')).toBeInTheDocument()
  })

  it('does not render notes element when notes is null', () => {
    render(<DatesList dates={[{ ...base, notes: null }]} />)
    expect(screen.queryByText('Replica straordinaria')).not.toBeInTheDocument()
  })
})

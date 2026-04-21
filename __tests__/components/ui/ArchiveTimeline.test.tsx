/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ArchiveTimeline from '@/components/ui/ArchiveTimeline'

const productions = [
  {
    id: 'p1', season_year: '2024', notes: null,
    plays: { title: 'Amleto', slug: 'amleto', poster_url: null, short_desc: null },
    dates: [
      { id: 'd1', date: '2024-11-15', time: '21:00:00', theater_name: 'Teatro Sociale', city: 'Milano' },
      { id: 'd2', date: '2024-11-22', time: '21:00:00', theater_name: 'Teatro Piccolo', city: 'Roma' },
    ],
  },
  {
    id: 'p2', season_year: '2022', notes: null,
    plays: { title: 'Aspettando Godot', slug: 'aspettando-godot', poster_url: null, short_desc: null },
    dates: [
      { id: 'd3', date: '2022-05-10', time: null, theater_name: 'Teatro Antico', city: 'Torino' },
    ],
  },
]

describe('ArchiveTimeline', () => {
  it('renders each season year', () => {
    render(<ArchiveTimeline productions={productions} />)
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('renders play titles linked to /spettacoli/[slug]', () => {
    render(<ArchiveTimeline productions={productions} />)
    const amletoLink = screen.getByText('Amleto').closest('a')
    expect(amletoLink).toHaveAttribute('href', '/spettacoli/amleto')
  })

  it('renders venue names', () => {
    render(<ArchiveTimeline productions={productions} />)
    expect(screen.getByText(/Teatro Sociale/)).toBeInTheDocument()
    expect(screen.getByText(/Teatro Antico/)).toBeInTheDocument()
  })

  it('shows correct date count per production', () => {
    render(<ArchiveTimeline productions={productions} />)
    expect(screen.getByText(/2 date/i)).toBeInTheDocument()
    expect(screen.getByText(/1 data/i)).toBeInTheDocument()
  })

  it('shows date notes when present', () => {
    const withNotes = [{
      ...productions[0],
      dates: [{ ...productions[0].dates[0], notes: 'Prima assoluta' }],
    }]
    render(<ArchiveTimeline productions={withNotes} />)
    expect(screen.getByText('Prima assoluta')).toBeInTheDocument()
  })

  it('does not render notes when null', () => {
    render(<ArchiveTimeline productions={productions} />)
    expect(screen.queryByText('Prima assoluta')).not.toBeInTheDocument()
  })
})

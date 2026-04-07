/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayGrid from '@/components/play/PlayGrid'

const plays = [
  { id: '1', slug: 'amleto', title: 'Amleto', short_desc: 'Il principe di Danimarca', poster_url: null },
  { id: '2', slug: 'godot', title: 'Aspettando Godot', short_desc: null, poster_url: null },
]

describe('PlayGrid', () => {
  it('renders a card for each play', () => {
    render(<PlayGrid plays={plays} />)
    expect(screen.getByText('Amleto')).toBeInTheDocument()
    expect(screen.getByText('Aspettando Godot')).toBeInTheDocument()
  })

  it('links each card to /spettacoli/[slug]', () => {
    render(<PlayGrid plays={plays} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/spettacoli/amleto')
    expect(links[1]).toHaveAttribute('href', '/spettacoli/godot')
  })

  it('renders empty state when no plays', () => {
    render(<PlayGrid plays={[]} />)
    expect(screen.getByText(/nessuno spettacolo/i)).toBeInTheDocument()
  })

  it('renders short_desc when present', () => {
    render(<PlayGrid plays={plays} />)
    expect(screen.getByText('Il principe di Danimarca')).toBeInTheDocument()
  })
})

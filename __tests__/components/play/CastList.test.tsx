/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import CastList from '@/components/play/CastList'

const cast = [
  { character_name: 'Amleto', role: 'actor', people: { id: '1', slug: 'mario-rossi', name: 'Mario Rossi', photo_url: null } },
  { character_name: 'Ofelia', role: 'actor', people: { id: '2', slug: 'giulia-bianchi', name: 'Giulia Bianchi', photo_url: null } },
]

describe('CastList', () => {
  it('renders character and person name for each entry', () => {
    render(<CastList cast={cast} />)
    expect(screen.getByText('Amleto')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
    expect(screen.getByText('Ofelia')).toBeInTheDocument()
    expect(screen.getByText('Giulia Bianchi')).toBeInTheDocument()
  })

  it('links each person to /attori/[slug]', () => {
    render(<CastList cast={cast} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/attori/mario-rossi')
    expect(links[1]).toHaveAttribute('href', '/attori/giulia-bianchi')
  })

  it('renders nothing when cast is empty', () => {
    const { container } = render(<CastList cast={[]} />)
    expect(container.firstChild).toBeNull()
  })
})

/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import PersonCard from '@/components/person/PersonCard'

const person = {
  id: '1', slug: 'mario-rossi', name: 'Mario Rossi',
  role: 'actor', bio: 'Attore di lunga esperienza.', photo_url: null,
  is_active: true, joined_at: '2020-01-01',
}

describe('PersonCard', () => {
  it('renders the person name', () => {
    render(<PersonCard person={person} />)
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('links to /attori/[slug]', () => {
    render(<PersonCard person={person} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/attori/mario-rossi')
  })

  it('renders role label', () => {
    render(<PersonCard person={person} />)
    expect(screen.getByText(/attore/i)).toBeInTheDocument()
  })

  it('renders photo when photo_url is set', () => {
    render(<PersonCard person={{ ...person, photo_url: 'https://example.com/photo.jpg' }} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('renders placeholder when no photo', () => {
    render(<PersonCard person={person} />)
    const placeholder = screen.getByLabelText('Foto non disponibile')
    expect(placeholder).toBeInTheDocument()
  })
})

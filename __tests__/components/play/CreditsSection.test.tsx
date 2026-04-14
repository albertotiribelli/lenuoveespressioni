/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import CreditsSection from '@/components/play/CreditsSection'

const credits = [
  { character_name: null,     role: 'director',   onlyDate: null, people: { id: '1', slug: 'sonia-turella',    name: 'Sonia Turella',    photo_url: null } },
  { character_name: 'Amleto', role: 'actor',       onlyDate: null, people: { id: '2', slug: 'mario-rossi',     name: 'Mario Rossi',      photo_url: null } },
  { character_name: 'Ofelia', role: 'actor',       onlyDate: null, people: { id: '3', slug: 'giulia-bianchi',  name: 'Giulia Bianchi',   photo_url: null } },
  { character_name: 'Ospite', role: 'actor',       onlyDate: '2024-11-22', people: { id: '4', slug: 'luca-verdi', name: 'Luca Verdi',  photo_url: null } },
  { character_name: null,     role: 'technician',  onlyDate: null, people: { id: '5', slug: 'paolo-neri',      name: 'Paolo Neri',       photo_url: null } },
  { character_name: null,     role: 'other',       onlyDate: null, people: { id: '6', slug: 'anna-belli',      name: 'Anna Belli',       photo_url: null } },
]

describe('CreditsSection', () => {
  it('renders a Regia section for directors', () => {
    render(<CreditsSection credits={credits} />)
    expect(screen.getByText('Regia')).toBeInTheDocument()
    expect(screen.getByText('Sonia Turella')).toBeInTheDocument()
  })

  it('renders a Cast section for actors', () => {
    render(<CreditsSection credits={credits} />)
    expect(screen.getByText('Cast')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
    expect(screen.getByText('Giulia Bianchi')).toBeInTheDocument()
  })

  it('renders character names only in the Cast section', () => {
    render(<CreditsSection credits={credits} />)
    expect(screen.getByText('Amleto')).toBeInTheDocument()
    expect(screen.getByText('Ofelia')).toBeInTheDocument()
  })

  it('renders a Tecnici section for technicians', () => {
    render(<CreditsSection credits={credits} />)
    expect(screen.getByText('Tecnici')).toBeInTheDocument()
    expect(screen.getByText('Paolo Neri')).toBeInTheDocument()
  })

  it('renders a Collaboratori section for others', () => {
    render(<CreditsSection credits={credits} />)
    expect(screen.getByText('Collaboratori')).toBeInTheDocument()
    expect(screen.getByText('Anna Belli')).toBeInTheDocument()
  })

  it('does not render a section heading for roles with no entries', () => {
    const actorsOnly = credits.filter((c) => c.role === 'actor')
    render(<CreditsSection credits={actorsOnly} />)
    expect(screen.queryByText('Regia')).not.toBeInTheDocument()
    expect(screen.queryByText('Tecnici')).not.toBeInTheDocument()
  })

  it('shows date annotation for per-date actors', () => {
    render(<CreditsSection credits={credits} />)
    expect(screen.getByText('Luca Verdi')).toBeInTheDocument()
    expect(screen.getByText(/22 novembre 2024/i)).toBeInTheDocument()
  })

  it('links all people to /attori/[slug]', () => {
    render(<CreditsSection credits={credits} />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/attori/sonia-turella')
    expect(hrefs).toContain('/attori/mario-rossi')
    expect(hrefs).toContain('/attori/paolo-neri')
  })
})

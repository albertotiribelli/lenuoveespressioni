/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import NewsList from '@/components/news/NewsList'

const items = [
  {
    id: '1',
    slug: 'recap-showman',
    title: 'Un successo al Teatro Excelsior',
    body: 'Serata splendida.\n\nGrazie a tutti.',
    published_at: '2026-10-24T08:00:00Z',
    plays: { slug: 'greatest_showman', title: 'The Greatest Showman' },
  },
  { id: '2', slug: 'altro', title: 'Altra notizia', body: 'Testo', published_at: '2026-09-01T08:00:00Z', plays: null },
]

describe('NewsList', () => {
  it('shows each post with date, linked title, excerpt and a link to its play', () => {
    render(<NewsList items={items} />)
    expect(screen.getByRole('link', { name: 'Un successo al Teatro Excelsior' })).toHaveAttribute('href', '/news/recap-showman')
    expect(screen.getByText('Serata splendida. Grazie a tutti.')).toBeInTheDocument()
    expect(screen.getByText('24 ottobre 2026')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'The Greatest Showman' })).toHaveAttribute('href', '/spettacoli/greatest_showman')
  })

  it('does not render a play link for a post without a play', () => {
    render(<NewsList items={[items[1]]} />)
    expect(screen.getAllByRole('link')).toHaveLength(2) // title + "Leggi"
  })

  it('shows a message when there is no news', () => {
    render(<NewsList items={[]} />)
    expect(screen.getByText('Nessuna notizia al momento.')).toBeInTheDocument()
  })
})

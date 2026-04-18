/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import YoutubeEmbed from '@/components/ui/YoutubeEmbed'

describe('YoutubeEmbed', () => {
  it('renders an iframe with the correct embed URL', () => {
    render(<YoutubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />)
    const iframe = screen.getByTitle(/trailer/i)
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('renders nothing for an invalid URL', () => {
    const { container } = render(<YoutubeEmbed url="https://vimeo.com/123" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing for null', () => {
    const { container } = render(<YoutubeEmbed url={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('accepts a custom title', () => {
    render(<YoutubeEmbed url="https://youtu.be/dQw4w9WgXcQ" title="Trailer di Amleto" />)
    expect(screen.getByTitle('Trailer di Amleto')).toBeInTheDocument()
  })
})

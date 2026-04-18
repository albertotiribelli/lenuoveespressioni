import { extractYouTubeId, buildEmbedUrl } from '@/lib/youtube'

describe('extractYouTubeId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from shortened youtu.be URL', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from watch URL with extra params', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from embed URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubeId('https://vimeo.com/123456')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractYouTubeId('')).toBeNull()
  })
})

describe('buildEmbedUrl', () => {
  it('builds embed URL from a valid YouTube URL', () => {
    expect(buildEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('builds embed URL from youtu.be URL', () => {
    expect(buildEmbedUrl('https://youtu.be/dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('returns null for invalid URL', () => {
    expect(buildEmbedUrl('https://vimeo.com/123456')).toBeNull()
  })

  it('returns null for null input', () => {
    expect(buildEmbedUrl(null)).toBeNull()
  })
})

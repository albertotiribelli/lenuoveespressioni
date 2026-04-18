export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] || null
      return u.searchParams.get('v')
    }
    return null
  } catch {
    return null
  }
}

export function buildEmbedUrl(url: string | null): string | null {
  if (!url) return null
  const id = extractYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

// lib/newsText.ts — plain-text helpers for news bodies (blank lines separate paragraphs)

export function paragraphs(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, ' ').trim())
    .filter(Boolean)
}

// First `max` characters, cut at a word boundary, for list previews and meta descriptions.
export function excerpt(body: string, max = 180): string {
  const text = paragraphs(body).join(' ')
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

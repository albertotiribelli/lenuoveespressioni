import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig'

// Pages that define their own `openGraph` replace the inherited image, so each static page lists
// DEFAULT_OG_IMAGE explicitly. These tests keep that reference and the generated image in sync.
describe('default Open Graph image', () => {
  const source = readFileSync(join(process.cwd(), 'app', 'opengraph-image.tsx'), 'utf8')

  it('matches the size declared by the generated image', () => {
    expect(source).toContain(`size = { width: ${DEFAULT_OG_IMAGE.width}, height: ${DEFAULT_OG_IMAGE.height} }`)
  })

  it('points at the generated image route', () => {
    expect(DEFAULT_OG_IMAGE.url).toBe('/opengraph-image')
  })

  it('is used by every static page and none still falls back to the bare logo', () => {
    const pages = ['page.tsx', 'spettacoli/page.tsx', 'attori/page.tsx', 'archivio/page.tsx', 'media/page.tsx', 'chi-siamo/page.tsx', 'contatti/page.tsx']
    for (const page of pages) {
      const text = readFileSync(join(process.cwd(), 'app', page), 'utf8')
      expect(text).toContain('images: [DEFAULT_OG_IMAGE]')
      expect(text).not.toContain("url: '/logo.png'")
    }
  })
})

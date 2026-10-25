import { slugify, uniqueSlug } from '@/lib/admin/slug'

describe('slugify', () => {
  it('lowercases, folds accents and joins words with underscores like the existing slugs', () => {
    expect(slugify('Alberto Tiribelli')).toBe('alberto_tiribelli')
    expect(slugify("  L'Étoile -- d'Oro!  ")).toBe('l_etoile_d_oro')
    expect(slugify('From Zero to Hero 2')).toBe('from_zero_to_hero_2')
  })

  it('returns an empty string when nothing usable is left', () => {
    expect(slugify('***')).toBe('')
  })
})

describe('uniqueSlug', () => {
  it('keeps the base when free and ignores unrelated slugs', () => {
    expect(uniqueSlug('mario', ['mario_rossi', 'maria'])).toBe('mario')
  })

  it('appends the first free number when taken', () => {
    expect(uniqueSlug('mario', ['mario'])).toBe('mario_2')
    expect(uniqueSlug('mario', ['mario', 'mario_2', 'mario_4'])).toBe('mario_3')
  })
})

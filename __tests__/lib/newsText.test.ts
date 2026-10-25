import { excerpt, paragraphs } from '@/lib/newsText'

describe('paragraphs', () => {
  it('splits on blank lines and joins soft line breaks', () => {
    expect(paragraphs('Prima riga\nancora prima.\n\nSeconda.\r\n\r\n  Terza.  ')).toEqual(['Prima riga ancora prima.', 'Seconda.', 'Terza.'])
  })

  it('drops empty paragraphs', () => {
    expect(paragraphs('\n\n\n')).toEqual([])
    expect(paragraphs('')).toEqual([])
  })
})

describe('excerpt', () => {
  it('returns short text unchanged, as one paragraph', () => {
    expect(excerpt('Ciao.\n\nMondo.')).toBe('Ciao. Mondo.')
  })

  it('cuts long text at a word boundary and adds an ellipsis', () => {
    const text = 'parola '.repeat(60).trim()
    const out = excerpt(text, 50)
    expect(out.length).toBeLessThanOrEqual(50)
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toMatch(/par…$/)
  })

  it('still cuts a single very long word', () => {
    expect(excerpt('x'.repeat(300), 40)).toHaveLength(40)
  })
})

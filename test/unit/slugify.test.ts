import { describe, it, expect } from 'vitest'
import { slugify } from 'src/utils/slugify'

describe('slugify', () => {
  it('lowercases simple names', () => {
    expect(slugify('Nina')).toBe('nina')
    expect(slugify('Romeo')).toBe('romeo')
  })

  it('strips accents', () => {
    expect(slugify('Fumaça')).toBe('fumaca')
    expect(slugify('Narizinho')).toBe('narizinho')
  })

  it('replaces spaces and non-alphanumerics with a single hyphen', () => {
    expect(slugify('Dona Flor')).toBe('dona-flor')
    expect(slugify('Tom & Jerry')).toBe('tom-jerry')
  })

  it('trims leading/trailing hyphens', () => {
    expect(slugify(' Malu ')).toBe('malu')
  })
})

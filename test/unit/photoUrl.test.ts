import { describe, it, expect } from 'vitest'
import { photoUrl } from 'src/utils/photoUrl'

describe('photoUrl', () => {
  it('builds a /cats/<slug>.webp path from the cat name', () => {
    expect(photoUrl({ name: 'Nina' })).toBe('/cats/nina.webp')
  })

  it('uses the slugified name for accented names', () => {
    expect(photoUrl({ name: 'Fumaça' })).toBe('/cats/fumaca.webp')
  })
})

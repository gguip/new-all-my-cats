import { describe, it, expect } from 'vitest'
import { FAMILY } from 'src/data/family'
import { layoutTree, buildBlocks } from 'src/lib/familyLayout'
import { buildWires } from 'src/lib/familyWires'

describe('familyWires', () => {
  it('returns parent and partner path arrays', () => {
    const w = buildWires(layoutTree(FAMILY))
    expect(Array.isArray(w.parent)).toBe(true)
    expect(Array.isArray(w.partner)).toBe(true)
    expect(w.parent.length).toBeGreaterThan(0)
    expect(w.partner.length).toBeGreaterThan(0)
  })

  it('emits one partner path per couple block', () => {
    const couples = buildBlocks(FAMILY).filter((b) => b.adults.length === 2).length
    const w = buildWires(layoutTree(FAMILY))
    expect(w.partner.length).toBe(couples)
  })

  it('every path is a non-empty SVG d string starting with M', () => {
    const w = buildWires(layoutTree(FAMILY))
    for (const d of [...w.parent, ...w.partner]) {
      expect(typeof d).toBe('string')
      expect(d.trim().startsWith('M')).toBe(true)
    }
  })
})

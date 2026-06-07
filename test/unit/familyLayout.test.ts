import { describe, it, expect } from 'vitest'
import { FAMILY } from 'src/data/family'
import { computeGen, buildBlocks, layoutTree } from 'src/lib/familyLayout'

describe('familyLayout', () => {
  it('computes generations (founders 0, great-grandkittens 3)', () => {
    const gen = computeGen(FAMILY)
    expect(gen[1]).toBe(0) // Mingau
    expect(gen[2]).toBe(0) // Tom
    expect(gen[17]).toBe(3) // Simba
    expect(gen[18]).toBe(3) // Chico
  })

  it('equalises partners to the same generation', () => {
    const gen = computeGen(FAMILY)
    expect(gen[1]).toBe(gen[2]) // Mingau & Tom
    expect(gen[9]).toBe(gen[14]) // Tigrão & Nala
  })

  it('groups a couple into one block (Mingau + Tom)', () => {
    const blocks = buildBlocks(FAMILY)
    const founders = blocks.find((b) => b.adults.includes(1))
    expect(founders).toBeDefined()
    expect(founders!.adults.slice().sort((a, b) => a - b)).toEqual([1, 2])
  })

  it('positions every cat and reports positive canvas size', () => {
    const l = layoutTree(FAMILY)
    for (const c of FAMILY) expect(l.pos[c.id]).toBeDefined()
    expect(l.width).toBeGreaterThan(0)
    expect(l.height).toBeGreaterThan(0)
  })

  it('places partners on the same row (equal y)', () => {
    const l = layoutTree(FAMILY)
    expect(l.pos[1]!.y).toBe(l.pos[2]!.y)
  })
})

import type { FamilyCat } from 'src/data/family'

export const NODE_W = 116
export const COUPLE_GAP = 30
export const SIB_GAP = 50
export const ROOT_GAP = 90
export const GEN_H = 210
export const PAD = 80

export interface Block {
  adults: number[]
}
export interface Pos {
  x: number
  y: number
}
export interface Layout {
  pos: Record<number, Pos>
  gen: Record<number, number>
  blocks: Block[]
  byId: Record<number, FamilyCat>
  kidsOf: (b: Block) => Block[]
  width: number
  height: number
}

export function indexBy(cats: FamilyCat[]): Record<number, FamilyCat> {
  const m: Record<number, FamilyCat> = {}
  for (const c of cats) m[c.id] = c
  return m
}

export function computeGen(cats: FamilyCat[]): Record<number, number> {
  const byId = indexBy(cats)
  const gen: Record<number, number> = {}
  const g = (id: number | null, seen: Set<number>): number => {
    if (id == null) return -1
    const c = byId[id]
    if (!c) return -1
    const cached = gen[id]
    if (cached != null) return cached
    if (seen.has(id)) return 0 // cycle guard
    seen.add(id)
    let v = 0
    if (c.momId != null && byId[c.momId]) v = Math.max(v, g(c.momId, seen) + 1)
    if (c.dadId != null && byId[c.dadId]) v = Math.max(v, g(c.dadId, seen) + 1)
    seen.delete(id)
    gen[id] = v
    return v
  }
  for (const c of cats) g(c.id, new Set())
  // Equalise partners to the deeper generation. A few passes let the change
  // propagate along partner-of-partner chains; 6 comfortably covers a 4-gen tree.
  for (let i = 0; i < 6; i++) {
    for (const c of cats) {
      if (c.partnerId != null && byId[c.partnerId]) {
        const m = Math.max(gen[c.id] ?? 0, gen[c.partnerId] ?? 0)
        gen[c.id] = m
        gen[c.partnerId] = m
      }
    }
  }
  return gen
}

// group cats into blocks (a couple = 2 adults, blood adult first; else single)
export function buildBlocks(cats: FamilyCat[]): Block[] {
  const byId = indexBy(cats)
  const used = new Set<number>()
  const blocks: Block[] = []
  for (const c of cats) {
    if (used.has(c.id)) continue
    const p = c.partnerId != null ? byId[c.partnerId] : undefined
    if (p && !used.has(p.id)) {
      let a = c
      let b = p
      const aHas = a.momId != null || a.dadId != null
      const bHas = b.momId != null || b.dadId != null
      if (bHas && !aHas) {
        const t = a
        a = b
        b = t
      }
      blocks.push({ adults: [a.id, b.id] })
      used.add(a.id)
      used.add(b.id)
    } else {
      blocks.push({ adults: [c.id] })
      used.add(c.id)
    }
  }
  return blocks
}

export function keyOf(ids: number[]): string {
  return ids
    .slice()
    .sort((x, y) => x - y)
    .join('-')
}

// the parent-couple key a block descends from (null = root)
export function parentKey(block: Block, byId: Record<number, FamilyCat>): string | null {
  for (const id of block.adults) {
    const c = byId[id]
    if (!c) continue
    const ps: number[] = []
    if (c.momId != null && byId[c.momId]) ps.push(c.momId)
    if (c.dadId != null && byId[c.dadId]) ps.push(c.dadId)
    if (ps.length) return keyOf(ps)
  }
  return null
}

export function layoutTree(cats: FamilyCat[]): Layout {
  const byId = indexBy(cats)
  const gen = computeGen(cats)
  const blocks = buildBlocks(cats)

  const childMap: Record<string, Block[]> = {}
  for (const b of blocks) {
    const pk = parentKey(b, byId)
    if (pk == null) continue
    ;(childMap[pk] = childMap[pk] ?? []).push(b)
  }
  const kidsOf = (b: Block): Block[] => childMap[keyOf(b.adults)] ?? []

  const blockW = (b: Block): number => (b.adults.length === 2 ? NODE_W * 2 + COUPLE_GAP : NODE_W)
  const pos: Record<number, Pos> = {}

  const placeAdults = (b: Block, x: number): void => {
    const first = b.adults[0]
    const y = (first != null ? (gen[first] ?? 0) : 0) * GEN_H
    b.adults.forEach((id, i) => {
      pos[id] = { x: x + i * (NODE_W + COUPLE_GAP), y }
    })
  }
  const shift = (blocksArr: Block[], dx: number): void => {
    for (const b of blocksArr) {
      for (const id of b.adults) {
        const p = pos[id]
        if (p) p.x += dx
      }
      shift(kidsOf(b), dx)
    }
  }
  const place = (b: Block, leftX: number): number => {
    const kids = kidsOf(b)
    const bw = blockW(b)
    if (!kids.length) {
      placeAdults(b, leftX)
      return bw
    }
    let cx = leftX
    for (const k of kids) cx += place(k, cx) + SIB_GAP
    const kidsW = cx - SIB_GAP - leftX
    const width = Math.max(kidsW, bw)
    placeAdults(b, leftX + (width - bw) / 2)
    if (kidsW < width) shift(kids, (width - kidsW) / 2)
    return width
  }

  const roots = blocks.filter((b) => parentKey(b, byId) == null)
  let ox = 0
  for (const r of roots) ox += place(r, ox) + ROOT_GAP

  const all = Object.values(pos)
  const minX = all.length ? Math.min(...all.map((p) => p.x)) : 0
  for (const p of all) {
    p.x += PAD - minX
    p.y += PAD
  }
  const maxX = all.length ? Math.max(...all.map((p) => p.x)) : 0
  const maxY = all.length ? Math.max(...all.map((p) => p.y)) : 0

  return { pos, gen, blocks, kidsOf, byId, width: maxX + NODE_W + PAD, height: maxY + 160 + PAD }
}

# Genealogy Tree Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen, hardcoded family-tree page (`/familia`) showing the 18 cats as a pannable/zoomable/scrollable dynasty with SVG connectors and a read-only detail panel.

**Architecture:** Pure TS layout engine + wire-builder (ported from the design prototype, fully testable) feed a Vue 3 `<script setup>` page. The page renders an `overflow:auto` stage (lateral scroll), a scaled canvas with absolutely-positioned cat nodes and an SVG connector layer, plus drag-to-pan, zoom, and a read-only panel. Standalone route under a minimal full-screen layout; a nav link is added to the main site.

**Tech Stack:** Vue 3, Quasar 2 (Vite, TypeScript), vue-i18n, Vitest + @vue/test-utils.

**Design source (read-only reference):** decoded prototype at `/tmp/arvore_template.html` (CSS) + `/tmp/app1.js` (data), `/tmp/app2.js` (layout), `/tmp/app_babel.jsx` (wires/UI). All needed content is reproduced in this plan.

---

## Conventions

- Paths relative to project root `/Users/guilhermepassarinho/Desktop/Projects/new-all-my-cats-vue`.
- Node 22 required for `quasar`/`npm run build`. Prefix node/npm commands with:
  `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && <cmd>`
  Vitest runs on node 20 too, but use the prefix for consistency. Never run `quasar dev`/`build` inside a subagent — the final build is a dedicated task.
- `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are ON — index access into records is `T | undefined`; guard or assert.
- Commit after each task; append to every commit message:
  ```

  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  ```

## File Structure

```
src/data/family.ts                     # FamilyCat type + FAMILY (18, the dynasty)
src/lib/familyLayout.ts                # pure tidy-tree layout
src/lib/familyWires.ts                 # pure buildWires(layout)
src/composables/useDragPan.ts          # pointer drag -> stage scroll
src/css/family.scss                    # tree-specific CSS
src/components/family/FamilyTopBar.vue
src/components/family/TreeNode.vue
src/components/family/TreeDetailPanel.vue
src/components/family/ZoomControls.vue
src/layouts/FullScreenLayout.vue
src/pages/FamilyTreePage.vue
src/router/routes.ts                    # add /familia route (modify)
src/components/AppNav.vue               # add Família nav link (modify)
src/i18n/en.ts, src/i18n/pt-BR.ts       # add nav.family + family.* (modify)
src/css/app.scss                        # @import family.scss (modify)
test/unit/familyLayout.test.ts
test/unit/familyWires.test.ts
test/unit/useDragPan.test.ts
```

---

## Task 1: Family data module

**Files:** Create `src/data/family.ts`

- [ ] **Step 1: Create `src/data/family.ts`**

```ts
// Hardcoded genealogy of the 18 cats — an invented 4-generation dynasty
// descending from Mingau & Tom. Edit relationships here.
export type Sex = 'f' | 'm' | 'x'

export interface FamilyCat {
  id: number
  name: string
  birth: string // year as string, '' if unknown
  sex: Sex
  momId: number | null
  dadId: number | null
  partnerId: number | null
}

export const FAMILY: FamilyCat[] = [
  // Gen 0 — founders
  { id: 1, name: 'Mingau', birth: '2014', sex: 'f', momId: null, dadId: null, partnerId: 2 },
  { id: 2, name: 'Tom', birth: '2013', sex: 'm', momId: null, dadId: null, partnerId: 1 },
  // Gen 1 — kittens + spouses
  { id: 3, name: 'Biscoito', birth: '2017', sex: 'm', momId: 1, dadId: 2, partnerId: 6 },
  { id: 4, name: 'Amora', birth: '2017', sex: 'f', momId: 1, dadId: 2, partnerId: 7 },
  { id: 5, name: 'Frajola', birth: '2018', sex: 'm', momId: 1, dadId: 2, partnerId: 8 },
  { id: 6, name: 'Nina', birth: '2017', sex: 'f', momId: null, dadId: null, partnerId: 3 },
  { id: 7, name: 'Bóris', birth: '2016', sex: 'm', momId: null, dadId: null, partnerId: 4 },
  { id: 8, name: 'Maju', birth: '2018', sex: 'f', momId: null, dadId: null, partnerId: 5 },
  // Gen 2 — grandkittens + spouses
  { id: 9, name: 'Tigrão', birth: '2020', sex: 'm', momId: 6, dadId: 3, partnerId: 14 },
  { id: 10, name: 'Pipoca', birth: '2020', sex: 'f', momId: 6, dadId: 3, partnerId: 16 },
  { id: 11, name: 'Romeu', birth: '2020', sex: 'm', momId: 4, dadId: 7, partnerId: 15 },
  { id: 12, name: 'Bidu', birth: '2021', sex: 'm', momId: 4, dadId: 7, partnerId: null },
  { id: 13, name: 'Jujuba', birth: '2021', sex: 'f', momId: 8, dadId: 5, partnerId: null },
  { id: 14, name: 'Nala', birth: '2020', sex: 'f', momId: null, dadId: null, partnerId: 9 },
  { id: 15, name: 'Lola', birth: '2021', sex: 'f', momId: null, dadId: null, partnerId: 11 },
  { id: 16, name: 'Salem', birth: '2019', sex: 'm', momId: null, dadId: null, partnerId: 10 },
  // Gen 3 — great-grandkittens
  { id: 17, name: 'Simba', birth: '2023', sex: 'm', momId: 14, dadId: 9, partnerId: null },
  { id: 18, name: 'Chico', birth: '2023', sex: 'm', momId: 15, dadId: 11, partnerId: null },
]
```

- [ ] **Step 2: Lint**

Run: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npx eslint src/data/family.ts`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/family.ts
git commit -m "feat(family): hardcoded genealogy data (18 cats, 4 generations)"
```

---

## Task 2: Layout engine (`familyLayout.ts`)

**Files:** Create `src/lib/familyLayout.ts`, Test `test/unit/familyLayout.test.ts`

- [ ] **Step 1: Write the failing test**

`test/unit/familyLayout.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm run test -- familyLayout`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/familyLayout.ts`**

```ts
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
  // equalise partners to the deeper generation
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
```

- [ ] **Step 4: Run the test**

Run: `... nvm use ... && npm run test -- familyLayout`
Expected: PASS (5 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/lib/familyLayout.ts test/unit/familyLayout.test.ts
git commit -m "feat(family): pure tidy-tree layout engine"
```

---

## Task 3: Wire builder (`familyWires.ts`)

**Files:** Create `src/lib/familyWires.ts`, Test `test/unit/familyWires.test.ts`

- [ ] **Step 1: Write the failing test**

`test/unit/familyWires.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `... nvm use ... && npm run test -- familyWires`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/familyWires.ts`**

```ts
import type { Layout } from 'src/lib/familyLayout'

const NODE_W = 116
const NODE_H = 156

interface Rect {
  cx: number
  top: number
  bottom: number
  cy: number
}

export interface Wires {
  parent: string[]
  partner: string[]
}

export function buildWires(layout: Layout): Wires {
  const { pos, byId, blocks, kidsOf } = layout
  const rect = (id: number): Rect | null => {
    const p = pos[id]
    if (!p) return null
    return { cx: p.x + NODE_W / 2, top: p.y, bottom: p.y + NODE_H, cy: p.y + 84 / 2 + 10 }
  }
  const partner: string[] = []
  const parent: string[] = []

  for (const b of blocks) {
    // partner connector
    if (b.adults.length === 2) {
      const id0 = b.adults[0]!
      const id1 = b.adults[1]!
      const a = rect(id0)
      const c = rect(id1)
      if (a && c) {
        const y = Math.min(a.cy, c.cy)
        const x1 = Math.min(a.cx, c.cx)
        const x2 = Math.max(a.cx, c.cx)
        partner.push('M ' + (x1 + NODE_W / 2 - 2) + ' ' + y + ' H ' + (x2 - NODE_W / 2 + 2))
      }
    }
    // parent -> children
    const kids = kidsOf(b)
    if (kids.length) {
      const rs = b.adults.map(rect).filter((r): r is Rect => r != null)
      if (!rs.length) continue
      const pmid = rs.reduce((s, r) => s + r.cx, 0) / rs.length
      const pbottom = Math.max(...rs.map((r) => r.bottom))
      const childAnchors = kids
        .map((k) => {
          // anchor = blood adult (first with a parent), else first adult
          let anchorId = k.adults[0]!
          for (const id of k.adults) {
            const cc = byId[id]
            if (cc && (cc.momId != null || cc.dadId != null)) {
              anchorId = id
              break
            }
          }
          return rect(anchorId)
        })
        .filter((r): r is Rect => r != null)
      if (!childAnchors.length) continue
      const childTop = Math.min(...childAnchors.map((c) => c.top))
      const busY = (pbottom + childTop) / 2
      let d = 'M ' + pmid + ' ' + pbottom + ' V ' + busY + ' '
      const minX = Math.min(...childAnchors.map((c) => c.cx))
      const maxX = Math.max(...childAnchors.map((c) => c.cx))
      d += 'M ' + minX + ' ' + busY + ' H ' + maxX + ' '
      for (const c of childAnchors) d += 'M ' + c.cx + ' ' + busY + ' V ' + c.top + ' '
      parent.push(d)
    }
  }
  return { partner, parent }
}
```

- [ ] **Step 4: Run the test**

Run: `... nvm use ... && npm run test -- familyWires`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/lib/familyWires.ts test/unit/familyWires.test.ts
git commit -m "feat(family): SVG connector path builder"
```

---

## Task 4: Drag-to-pan composable

**Files:** Create `src/composables/useDragPan.ts`, Test `test/unit/useDragPan.test.ts`

- [ ] **Step 1: Write the failing test**

`test/unit/useDragPan.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useDragPan } from 'src/composables/useDragPan'

const Host = defineComponent({
  setup() {
    const stage = ref<HTMLElement | null>(null)
    useDragPan(stage)
    return () =>
      h('div', { class: 'stage', ref: stage }, [
        h('div', { class: 'canvas' }, [h('div', { class: 'node' }, 'n')]),
      ])
  },
})

function evt(type: string, x: number, y: number, target: Element) {
  const e = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true })
  target.dispatchEvent(e)
  return e
}

describe('useDragPan', () => {
  it('pans the stage scroll on background drag', () => {
    const w = mount(Host, { attachTo: document.body })
    const stage = w.get('.stage').element as HTMLElement
    const canvas = w.get('.canvas').element
    evt('pointerdown', 100, 100, canvas)
    evt('pointermove', 90, 80, canvas)
    expect(stage.scrollLeft).toBe(10) // 0 - (90 - 100)
    expect(stage.scrollTop).toBe(20) // 0 - (80 - 100)
    evt('pointerup', 90, 80, canvas)
    w.unmount()
  })

  it('does not pan when the drag starts on a node', () => {
    const w = mount(Host, { attachTo: document.body })
    const stage = w.get('.stage').element as HTMLElement
    const node = w.get('.node').element
    evt('pointerdown', 100, 100, node)
    evt('pointermove', 60, 60, node)
    expect(stage.scrollLeft).toBe(0)
    expect(stage.scrollTop).toBe(0)
    evt('pointerup', 60, 60, node)
    w.unmount()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `... nvm use ... && npm run test -- useDragPan`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/composables/useDragPan.ts`**

```ts
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

// Drag the empty canvas background to pan the stage's scroll position.
export function useDragPan(stageRef: Ref<HTMLElement | null>) {
  let down = false
  let sx = 0
  let sy = 0
  let l0 = 0
  let t0 = 0

  const onDown = (ev: PointerEvent) => {
    const target = ev.target as HTMLElement | null
    if (target && target.closest('.node')) return // let nodes handle their own clicks
    const stage = stageRef.value
    if (!stage) return
    down = true
    sx = ev.clientX
    sy = ev.clientY
    l0 = stage.scrollLeft
    t0 = stage.scrollTop
    stage.firstElementChild?.classList.add('grabbing')
  }
  const onMove = (ev: PointerEvent) => {
    if (!down) return
    const stage = stageRef.value
    if (!stage) return
    stage.scrollLeft = l0 - (ev.clientX - sx)
    stage.scrollTop = t0 - (ev.clientY - sy)
  }
  const onUp = () => {
    down = false
    stageRef.value?.firstElementChild?.classList.remove('grabbing')
  }

  onMounted(() => {
    const stage = stageRef.value
    if (!stage) return
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  })
  onBeforeUnmount(() => {
    stageRef.value?.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  })
}
```

- [ ] **Step 4: Run the test**

Run: `... nvm use ... && npm run test -- useDragPan`
Expected: PASS (2 assertions). If jsdom does not retain `scrollLeft` assignments in your environment, the composable is still correct; in that rare case, change the two assertions to spy that the setter was called — but first try as written (current jsdom retains assigned scrollLeft/scrollTop).

- [ ] **Step 5: Commit**

```bash
git add src/composables/useDragPan.ts test/unit/useDragPan.test.ts
git commit -m "feat(family): drag-to-pan composable"
```

---

## Task 5: Tree CSS (`family.scss`)

**Files:** Create `src/css/family.scss`, Modify `src/css/app.scss`

- [ ] **Step 1: Create `src/css/family.scss`**

```scss
/* ============================================================
   AllMyCats — Genealogy tree page (uses brand tokens)
   ============================================================ */

/* full-screen container (scoped — does NOT set body{overflow:hidden}) */
.family-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ---------- Top bar ---------- */
.tbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 22px;
  background: var(--olive);
  color: var(--cream-text);
  box-shadow: 0 8px 24px -16px rgba(0, 0, 0, 0.5);
  z-index: 30;
}
.tbar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tbar__brand .logo {
  width: 48px;
  height: 42px;
  font-size: 0;
  filter: none;
}
.tbar__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  color: #fff;
  line-height: 1.1;
}
.tbar__title small {
  display: block;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 12px;
  color: var(--cream-text);
  opacity: 0.8;
  letter-spacing: 0.3px;
}
.tbar__spacer {
  flex: 1;
}
.tbar__btns {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.tbtn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.3px;
  background: rgba(255, 255, 255, 0.14);
  color: var(--cream-text);
  padding: 9px 16px;
  border-radius: var(--r-pill);
  transition: background 0.18s, transform 0.18s, color 0.18s;
}
.tbtn:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-1px);
}
.tbtn--home {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
}

/* ---------- Canvas ---------- */
.stage {
  position: relative;
  flex: 1;
  overflow: auto;
  background: var(--cream);
}
.canvas {
  position: relative;
  transform-origin: 0 0;
}
.canvas.grab {
  cursor: grab;
}
.canvas.grabbing {
  cursor: grabbing;
}

/* connectors */
.wires {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}
.wire {
  fill: none;
  stroke: var(--olive);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.wire--partner {
  stroke: var(--orange);
  stroke-width: 2.5;
  stroke-dasharray: 1 7;
}

/* ---------- Cat node ---------- */
.node {
  position: absolute;
  z-index: 2;
  width: 116px;
  background: var(--surface-card);
  border: 1.5px solid var(--tan-2);
  border-radius: 18px;
  padding: 10px 10px 11px;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: transform 0.16s, box-shadow 0.16s, border-color 0.16s;
}
.node:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: var(--sage);
}
.node.sel {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(242, 135, 63, 0.25), var(--shadow-hover);
}
.node__photo {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: repeating-linear-gradient(135deg, var(--tan-2) 0 10px, var(--tan) 10px 20px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.node__photo span {
  font-family: var(--font-mono);
  font-size: 8.5px;
  color: var(--olive-2);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-align: center;
  padding: 0 4px;
  line-height: 1.25;
}
.node__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
  text-align: center;
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1.05;
}
.node__birth {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 11px;
  color: var(--gray);
  margin-top: -3px;
}
.sexdot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex: 0 0 auto;
}
.sex-f {
  background: #d98aa6;
}
.sex-m {
  background: #6f8fae;
}
.sex-x {
  background: var(--sage);
}

/* ---------- Read-only detail panel ---------- */
.panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  z-index: 40;
  background: #fffaf0;
  border-left: 1.5px solid var(--tan-2);
  box-shadow: -18px 0 40px -28px rgba(60, 58, 44, 0.5);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.5, 0.05, 0.2, 1);
  display: flex;
  flex-direction: column;
}
.panel.open {
  transform: none;
}
.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
}
.panel__head h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 19px;
  color: var(--olive);
}
.panel__close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--tan);
  color: var(--ink);
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s;
}
.panel__close:hover {
  background: var(--tan-2);
}
.panel__body {
  padding: 4px 20px 20px;
  overflow-y: auto;
  flex: 1;
}
.field {
  margin-bottom: 14px;
}
.field label {
  display: block;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 12px;
  color: var(--olive-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.panel__val {
  margin: 0;
  font-family: var(--font-body);
  font-size: 14.5px;
  color: var(--ink);
}
.panel__divider {
  height: 1px;
  background: var(--tan-2);
  margin: 18px 0;
}

/* hint chip */
.hintchip {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 20;
  max-width: 280px;
  background: rgba(255, 250, 240, 0.94);
  border: 1.5px solid var(--tan-2);
  border-radius: 14px;
  padding: 11px 14px;
  font-family: var(--font-body);
  font-size: 12.5px;
  color: var(--body);
  line-height: 1.4;
  box-shadow: var(--shadow-soft);
}
.hintchip b {
  font-family: var(--font-display);
  color: var(--olive);
}

/* zoom controls */
.zoom {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.panel.open ~ .zoom {
  right: 338px;
}
.zoom button {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fffaf0;
  border: 1.5px solid var(--tan-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
  transition: background 0.16s, transform 0.16s;
}
.zoom button:hover {
  background: #fff;
  transform: translateY(-1px);
}

@media (max-width: 620px) {
  .tbar__title small {
    display: none;
  }
  .panel {
    width: 88vw;
  }
  .panel.open ~ .zoom {
    right: 18px;
    bottom: auto;
    top: 78px;
  }
  .hintchip {
    display: none;
  }
}
```

- [ ] **Step 2: Import it from `src/css/app.scss`**

Add this line at the END of `src/css/app.scss` (after the existing responsive blocks):
```scss
@import './family';
```

- [ ] **Step 3: Verify no SCSS/lint break**

Run: `... nvm use ... && npm run test` (suite still green) and `npx eslint src/css/family.scss || true` (eslint may not lint scss — ignore if it reports "no files"). The real check is the build in Task 9.

- [ ] **Step 4: Commit**

```bash
git add src/css/family.scss src/css/app.scss
git commit -m "feat(family): tree page stylesheet"
```

---

## Task 6: Presentational components (TopBar, Node, Panel, Zoom)

**Files:** Create `src/components/family/FamilyTopBar.vue`, `TreeNode.vue`, `TreeDetailPanel.vue`, `ZoomControls.vue`

- [ ] **Step 1: Create `src/components/family/FamilyTopBar.vue`**

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LogoBlob } from 'src/components/Illustrations'

const { t } = useI18n()
</script>

<template>
  <div class="tbar">
    <router-link class="tbar__brand" to="/" :title="t('family.back')">
      <LogoBlob />
      <span class="tbar__title">{{ t('family.title') }}<small>{{ t('family.subtitle') }}</small></span>
    </router-link>
    <div class="tbar__spacer" />
    <div class="tbar__btns">
      <router-link class="tbtn tbtn--home" to="/">← {{ t('family.back') }}</router-link>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create `src/components/family/TreeNode.vue`**

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'

const props = defineProps<{
  cat: FamilyCat
  x: number
  y: number
  selected?: boolean
}>()
defineEmits<{ select: [id: number] }>()

const { t } = useI18n()
// loosened signature for the parameterized photo-tag key
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const sexCls = (s: FamilyCat['sex']) => (s === 'f' ? 'sex-f' : s === 'm' ? 'sex-m' : 'sex-x')
</script>

<template>
  <div
    class="node"
    :class="{ sel: props.selected }"
    :style="{ left: props.x + 'px', top: props.y + 'px' }"
    @click.stop="$emit('select', props.cat.id)"
  >
    <div class="node__photo"><span>{{ td('cat.photoTag', { name: props.cat.name }) }}</span></div>
    <div class="node__name">
      <span class="sexdot" :class="sexCls(props.cat.sex)" />{{ props.cat.name || '—' }}
    </div>
    <div v-if="props.cat.birth" class="node__birth">{{ props.cat.birth }}</div>
  </div>
</template>
```

- [ ] **Step 3: Create `src/components/family/TreeDetailPanel.vue`**

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'

const props = defineProps<{
  cat: FamilyCat | null
  byId: Record<number, FamilyCat>
}>()
defineEmits<{ close: [] }>()

const { t } = useI18n()
const nameOf = (id: number | null): string =>
  id != null ? (props.byId[id]?.name ?? t('family.none')) : t('family.none')
const sexLabel = (s: FamilyCat['sex']): string =>
  s === 'f' ? t('family.sexF') : s === 'm' ? t('family.sexM') : t('family.sexX')
</script>

<template>
  <div class="panel" :class="{ open: props.cat }">
    <template v-if="props.cat">
      <div class="panel__head">
        <h3>{{ t('family.detail') }}</h3>
        <button class="panel__close" :aria-label="t('a11y.close')" @click="$emit('close')">×</button>
      </div>
      <div class="panel__body">
        <div class="field"><label>{{ t('family.fName') }}</label><p class="panel__val">{{ props.cat.name }}</p></div>
        <div class="field"><label>{{ t('family.fBirth') }}</label><p class="panel__val">{{ props.cat.birth || t('family.none') }}</p></div>
        <div class="field"><label>{{ t('family.fSex') }}</label><p class="panel__val">{{ sexLabel(props.cat.sex) }}</p></div>
        <div class="panel__divider" />
        <div class="field"><label>{{ t('family.fMom') }}</label><p class="panel__val">{{ nameOf(props.cat.momId) }}</p></div>
        <div class="field"><label>{{ t('family.fDad') }}</label><p class="panel__val">{{ nameOf(props.cat.dadId) }}</p></div>
        <div class="field"><label>{{ t('family.fPartner') }}</label><p class="panel__val">{{ nameOf(props.cat.partnerId) }}</p></div>
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 4: Create `src/components/family/ZoomControls.vue`**

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineEmits<{ 'zoom-in': []; 'zoom-out': [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="zoom">
    <button :aria-label="t('family.zoomIn')" @click="$emit('zoom-in')">+</button>
    <button :aria-label="t('family.zoomOut')" @click="$emit('zoom-out')">−</button>
  </div>
</template>
```

- [ ] **Step 5: Lint**

Run: `... nvm use ... && npx eslint src/components/family/*.vue`
Expected: no errors. (i18n keys used here are added in Task 8; eslint does not validate i18n keys, so this passes now. The build in Task 9 is the integration check.)

- [ ] **Step 6: Commit**

```bash
git add src/components/family
git commit -m "feat(family): top bar, node, detail panel, zoom components"
```

---

## Task 7: Page + full-screen layout

**Files:** Create `src/layouts/FullScreenLayout.vue`, `src/pages/FamilyTreePage.vue`

- [ ] **Step 1: Create `src/layouts/FullScreenLayout.vue`**

```vue
<template>
  <router-view />
</template>
```

- [ ] **Step 2: Create `src/pages/FamilyTreePage.vue`**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FAMILY } from 'src/data/family'
import { layoutTree } from 'src/lib/familyLayout'
import { buildWires } from 'src/lib/familyWires'
import { useDragPan } from 'src/composables/useDragPan'
import FamilyTopBar from 'src/components/family/FamilyTopBar.vue'
import TreeNode from 'src/components/family/TreeNode.vue'
import TreeDetailPanel from 'src/components/family/TreeDetailPanel.vue'
import ZoomControls from 'src/components/family/ZoomControls.vue'

const { t } = useI18n()
const layout = layoutTree(FAMILY)
const wires = buildWires(layout)

const selId = ref<number | null>(null)
const zoom = ref(1)
const stageRef = ref<HTMLElement | null>(null)
useDragPan(stageRef)

const selected = computed<typeof FAMILY[number] | null>(() =>
  selId.value != null ? (layout.byId[selId.value] ?? null) : null,
)
const canvasStyle = computed(() => ({
  width: layout.width + 'px',
  height: layout.height + 'px',
  transform: `scale(${zoom.value})`,
}))
const zoomIn = () => {
  zoom.value = Math.min(1.6, +(zoom.value + 0.15).toFixed(2))
}
const zoomOut = () => {
  zoom.value = Math.max(0.5, +(zoom.value - 0.15).toFixed(2))
}
</script>

<template>
  <div class="family-root">
    <FamilyTopBar />

    <div ref="stageRef" class="stage" @click="selId = null">
      <div class="canvas grab" :style="canvasStyle">
        <svg
          class="wires"
          :width="layout.width"
          :height="layout.height"
          :viewBox="`0 0 ${layout.width} ${layout.height}`"
        >
          <path v-for="(d, i) in wires.parent" :key="'p' + i" class="wire" :d="d" />
          <path v-for="(d, i) in wires.partner" :key="'h' + i" class="wire wire--partner" :d="d" />
        </svg>
        <TreeNode
          v-for="c in FAMILY"
          :key="c.id"
          :cat="c"
          :x="layout.pos[c.id]?.x ?? 0"
          :y="layout.pos[c.id]?.y ?? 0"
          :selected="c.id === selId"
          @select="selId = $event"
        />
      </div>
    </div>

    <div class="hintchip"><b>{{ t('family.hintLabel') }}</b>{{ t('family.hint') }}</div>

    <ZoomControls @zoom-in="zoomIn" @zoom-out="zoomOut" />

    <TreeDetailPanel :cat="selected" :by-id="layout.byId" @close="selId = null" />
  </div>
</template>
```

- [ ] **Step 3: Lint**

Run: `... nvm use ... && npx eslint src/layouts/FullScreenLayout.vue src/pages/FamilyTreePage.vue`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/FullScreenLayout.vue src/pages/FamilyTreePage.vue
git commit -m "feat(family): tree page and full-screen layout"
```

---

## Task 8: i18n keys + route + nav link

**Files:** Modify `src/i18n/en.ts`, `src/i18n/pt-BR.ts`, `src/router/routes.ts`, `src/components/AppNav.vue`

- [ ] **Step 1: Add `nav.family` and the `family` block to `src/i18n/en.ts`**

Inside the `nav` object add `family: 'Family',`. Add this top-level block (sibling of `nav`, `hero`, etc.):
```ts
  family: {
    title: 'Family Tree',
    subtitle: 'The cat dynasty',
    back: 'Back to site',
    hintLabel: 'Tip: ',
    hint: 'Click a cat for details. Drag the background to move the tree.',
    detail: 'Details',
    fName: 'Name',
    fBirth: 'Birth',
    fSex: 'Sex',
    fMom: 'Mother',
    fDad: 'Father',
    fPartner: 'Partner',
    sexF: 'Female',
    sexM: 'Male',
    sexX: 'Unknown',
    none: '—',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },
```

- [ ] **Step 2: Add the same keys to `src/i18n/pt-BR.ts`**

Inside `nav` add `family: 'Família',`. Add:
```ts
  family: {
    title: 'Árvore Genealógica',
    subtitle: 'A dinastia dos gatos',
    back: 'Voltar ao site',
    hintLabel: 'Dica: ',
    hint: 'Clique num gato para ver detalhes. Arraste o fundo para mover a árvore.',
    detail: 'Detalhes',
    fName: 'Nome',
    fBirth: 'Nascimento',
    fSex: 'Sexo',
    fMom: 'Mãe',
    fDad: 'Pai',
    fPartner: 'Parceiro(a)',
    sexF: 'Fêmea',
    sexM: 'Macho',
    sexX: 'Desconhecido',
    none: '—',
    zoomIn: 'Aproximar',
    zoomOut: 'Afastar',
  },
```
(Because `pt-BR.ts` is typed `const ptBR: typeof en`, the key sets must match exactly — add `nav.family` and the `family` block in both.)

- [ ] **Step 3: Add the route in `src/router/routes.ts`**

Insert this route object BEFORE the catch-all `/:catchAll(.*)*` entry:
```ts
  {
    path: '/familia',
    component: () => import('layouts/FullScreenLayout.vue'),
    children: [{ path: '', component: () => import('pages/FamilyTreePage.vue') }],
  },
```

- [ ] **Step 4: Add the nav link in `src/components/AppNav.vue`**

In the right-hand nav group, after the two anchor links, add a router-link. Change the `nav__links--r` block from:
```vue
      <nav class="nav__links nav__links--r">
        <a v-for="l in links.slice(2)" :key="l.key" class="nav__link" :href="l.href" @click="close">
          {{ t(l.key) }}
        </a>
      </nav>
```
to:
```vue
      <nav class="nav__links nav__links--r">
        <a v-for="l in links.slice(2)" :key="l.key" class="nav__link" :href="l.href" @click="close">
          {{ t(l.key) }}
        </a>
        <router-link class="nav__link" to="/familia" @click="close">{{ t('nav.family') }}</router-link>
      </nav>
```
And in the drawer, after the `v-for` of `drawer__link` anchors, add:
```vue
        <router-link class="drawer__link" to="/familia" @click="close">{{ t('nav.family') }}</router-link>
```

- [ ] **Step 5: Verify suite + i18n parity**

Run: `... nvm use ... && npm run test`
Expected: all prior tests still pass (i18n test asserts both locales have the same keys — it will fail if you forgot to add the `family` block or `nav.family` to either locale; if it fails, fix the missing keys).

- [ ] **Step 6: Lint**

Run: `... nvm use ... && npx eslint src/i18n/en.ts src/i18n/pt-BR.ts src/router/routes.ts src/components/AppNav.vue`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/en.ts src/i18n/pt-BR.ts src/router/routes.ts src/components/AppNav.vue
git commit -m "feat(family): i18n strings, /familia route, nav link"
```

---

## Task 9: Full verification & build

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm run test`
Expected: all suites pass (existing 21 + familyLayout 5 + familyWires 3 + useDragPan 2 = 31).

- [ ] **Step 2: Production build (type-checks the app)**

Run: `... nvm use ... && npm run build`
Expected: build succeeds, `dist/spa` produced, no TS errors. If `exactOptionalPropertyTypes`/`noUncheckedIndexedAccess` surface an error, fix at the indicated file:line (guard the index access or assert with `!` where provably present), then rebuild.

- [ ] **Step 3: Manual smoke (optional, run in main session)**

Run: `... nvm use ... && npm run dev`, open `http://localhost:9000/familia`. Verify: tree renders with connectors (olive parent, orange dashed partner), the stage scrolls (scrollbars / wheel) and drag-pans, zoom +/− works, clicking a cat highlights it and opens the read-only panel (name/birth/sex/mom/dad/partner resolved), "← Voltar ao site" returns to `/`, and the home nav shows a "Família/Family" link that routes here. Toggle PT/EN on the home page, then navigate — labels localized. Stop the server.

- [ ] **Step 4: Final commit (if any fixes were made in Step 2)**

```bash
git add -A
git commit -m "chore(family): verified build + tests green"
```

---

## Self-Review (author checklist — applied)

**Spec coverage:** data (T1), layout engine (T2), wires (T3), drag-pan (T4), CSS (T5), TopBar/Node/Panel/Zoom (T6), page + full-screen layout (T7), i18n + route + nav link (T8), verify/build (T9). Read-only panel (no edit/delete) — T6 TreeDetailPanel has no inputs. Removed CRUD — no add/restore/localStorage anywhere. Lateral scroll — `.stage{overflow:auto}` (T5) + drag-pan (T4). Zoom 0.5–1.6 step .15 (T7). Wires olive/orange-dashed (T5 classes, T3 data). Standalone `/familia` full-screen, no AppNav (T7 layout, T8 route). Nav link (T8).

**Placeholder scan:** none — all code blocks complete; no TBD/TODO.

**Type/name consistency:** `FamilyCat`/`Sex`/`FAMILY` (T1) used in T2/T3/T6/T7. `Layout`/`Block`/`Pos` exported (T2) and consumed by `buildWires` (T3) and page (T7). `Wires` (T3) used in page. `useDragPan(stageRef: Ref<HTMLElement|null>)` (T4) called with `stageRef` (T7). Component events: TreeNode emits `select:[id:number]` → page `@select="selId = $event"`; ZoomControls emits `zoom-in`/`zoom-out` → page `@zoom-in/@zoom-out`; TreeDetailPanel emits `close` → page `@close`. i18n keys referenced in T6/T7 (`family.*`, `a11y.close`, `cat.photoTag`, `nav.family`) all defined in T8 (a11y.close + cat.photoTag already exist from the main site).

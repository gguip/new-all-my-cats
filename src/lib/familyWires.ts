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

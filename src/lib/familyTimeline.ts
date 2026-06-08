import type { FamilyCat } from 'src/data/family'

export interface Litter {
  momName: string
  birth: string // birth year of the litter
  kittens: FamilyCat[]
}

export interface YearBucket {
  year: string // year, or '' for the "no date" bucket
  cats: FamilyCat[] // motherless cats that arrived this year
  litters: Litter[] // litters born this year
}

const byName = (a: FamilyCat, b: FamilyCat): number => a.name.localeCompare(b.name)

export function buildTimeline(cats: FamilyCat[]): YearBucket[] {
  const map = new Map<string, YearBucket>()
  const bucket = (year: string): YearBucket => {
    let b = map.get(year)
    if (!b) {
      b = { year, cats: [], litters: [] }
      map.set(year, b)
    }
    return b
  }

  for (const c of cats) {
    if (c.momName) continue
    bucket(c.arrival).cats.push(c)
  }

  const litterMap = new Map<string, Litter>()
  for (const c of cats) {
    if (!c.momName) continue
    const birth = c.birth ?? ''
    const key = c.momName + '|' + birth
    let lit = litterMap.get(key)
    if (!lit) {
      lit = { momName: c.momName, birth, kittens: [] }
      litterMap.set(key, lit)
      bucket(birth).litters.push(lit)
    }
    lit.kittens.push(c)
  }

  for (const b of map.values()) {
    b.cats.sort(byName)
    for (const lit of b.litters) lit.kittens.sort(byName)
  }

  return [...map.values()].sort((a, b) => {
    if (a.year === '') return 1
    if (b.year === '') return -1
    return a.year.localeCompare(b.year)
  })
}

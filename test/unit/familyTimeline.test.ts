import { describe, it, expect } from 'vitest'
import type { FamilyCat } from 'src/data/family'
import { buildTimeline } from 'src/lib/familyTimeline'

const sample: FamilyCat[] = [
  { name: 'Mingau', arrival: '2016', birth: '2014', sex: 'f' },
  { name: 'Amora', arrival: '2017', birth: '2017', sex: 'f', momName: 'Mingau' },
  { name: 'Biscoito', arrival: '2017', birth: '2017', sex: 'm', momName: 'Mingau' },
  { name: 'Tom', arrival: '2016', birth: '2013', sex: 'm' },
  { name: 'Fantasma', arrival: '', sex: 'x' },
]

describe('buildTimeline', () => {
  it('groups motherless cats into their arrival-year bucket', () => {
    const buckets = buildTimeline(sample)
    const y2016 = buckets.find((b) => b.year === '2016')
    expect(y2016).toBeDefined()
    expect(y2016!.cats.map((c) => c.name).sort()).toEqual(['Mingau', 'Tom'])
  })

  it('puts a litter in the kittens birth-year bucket, not the mother year', () => {
    const buckets = buildTimeline(sample)
    const y2017 = buckets.find((b) => b.year === '2017')
    expect(y2017).toBeDefined()
    expect(y2017!.cats).toHaveLength(0)
    expect(y2017!.litters).toHaveLength(1)
    expect(y2017!.litters[0]!.momName).toBe('Mingau')
    expect(y2017!.litters[0]!.kittens.map((k) => k.name).sort()).toEqual(['Amora', 'Biscoito'])
  })

  it('orders buckets ascending by year', () => {
    const buckets = buildTimeline(sample).map((b) => b.year).filter((y) => y !== '')
    expect(buckets).toEqual([...buckets].sort())
  })

  it('places the empty-year (no date) bucket last', () => {
    const buckets = buildTimeline(sample)
    expect(buckets[buckets.length - 1]!.year).toBe('')
    expect(buckets[buckets.length - 1]!.cats.map((c) => c.name)).toEqual(['Fantasma'])
  })

  it('sorts cats within a bucket by name', () => {
    const buckets = buildTimeline(sample)
    const y2016 = buckets.find((b) => b.year === '2016')!
    expect(y2016.cats.map((c) => c.name)).toEqual(['Mingau', 'Tom'])
  })
})

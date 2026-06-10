import { describe, it, expect } from 'vitest'
import { yearsHome, arrivalYearOf } from 'src/utils/yearsHome'

describe('yearsHome', () => {
  it('counts full years between arrival and current year', () => {
    expect(yearsHome(2012, 2026)).toBe(14)
  })

  it('returns 1 for a single year (singular case)', () => {
    expect(yearsHome(2025, 2026)).toBe(1)
  })

  it('returns 0 for a cat that arrived this year', () => {
    expect(yearsHome(2026, 2026)).toBe(0)
  })

  it('never returns a negative number for future arrivals', () => {
    expect(yearsHome(2030, 2026)).toBe(0)
  })
})

describe('arrivalYearOf', () => {
  it('returns the arrival year for a known cat', () => {
    expect(arrivalYearOf('Nina')).toBe(2012)
    expect(arrivalYearOf('Romeo')).toBe(2023)
  })

  it('returns undefined for an unknown name', () => {
    expect(arrivalYearOf('Mingau')).toBeUndefined()
  })
})

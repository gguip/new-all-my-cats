import { FAMILY } from 'src/data/family'

/** Full years a cat has been with the family. Never negative. */
export function yearsHome(arrivalYear: number, currentYear: number): number {
  return Math.max(0, currentYear - arrivalYear)
}

const ARRIVAL_BY_NAME: ReadonlyMap<string, number> = new Map(
  FAMILY.map((f) => [f.name, Number(f.arrival)]),
)

/** Arrival year for a cat by name, or undefined if not in FAMILY. */
export function arrivalYearOf(name: string): number | undefined {
  return ARRIVAL_BY_NAME.get(name)
}

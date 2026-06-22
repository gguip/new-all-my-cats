import { slugify } from './slugify'

/** Public path to a cat's standardized photo. The file may not exist yet. */
export function photoUrl(cat: { name: string }): string {
  return `/cats/${slugify(cat.name)}.webp`
}

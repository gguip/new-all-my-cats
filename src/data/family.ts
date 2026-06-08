// Real-world roster for the family timeline. Cats are organised by the YEAR
// THEY ARRIVED. Only two cats (Mingau, Maju) had litters; their kittens carry
// `momName` and are grouped into a litter box at their BIRTH year. Names match
// CATS[].name in cats.ts so the detail panel can show personality stats.
// Edit arrival/birth years and litter membership here as real data arrives.
export type Sex = 'f' | 'm' | 'x'

export interface FamilyCat {
  name: string // join key with CATS[].name
  arrival: string // year arrived in the family — timeline axis ('' if unknown)
  birth?: string // birth year (optional)
  sex: Sex
  momName?: string // set only on the kittens of the two litters
}

export const FAMILY: FamilyCat[] = [
  // Mother #1 and her litter
  { name: 'Mingau', arrival: '2016', birth: '2014', sex: 'f' },
  { name: 'Amora', arrival: '2017', birth: '2017', sex: 'f', momName: 'Mingau' },
  { name: 'Biscoito', arrival: '2017', birth: '2017', sex: 'm', momName: 'Mingau' },
  // Mother #2 and her litter
  { name: 'Maju', arrival: '2017', birth: '2016', sex: 'f' },
  { name: 'Jujuba', arrival: '2019', birth: '2019', sex: 'f', momName: 'Maju' },
  { name: 'Bidu', arrival: '2019', birth: '2019', sex: 'm', momName: 'Maju' },
  // Unrelated arrivals
  { name: 'Tom', arrival: '2016', birth: '2013', sex: 'm' },
  { name: 'Frajola', arrival: '2018', birth: '2018', sex: 'm' },
  { name: 'Nina', arrival: '2018', birth: '2017', sex: 'f' },
  { name: 'Bóris', arrival: '2018', birth: '2016', sex: 'm' },
  { name: 'Salem', arrival: '2019', birth: '2019', sex: 'm' },
  { name: 'Pipoca', arrival: '2020', birth: '2020', sex: 'f' },
  { name: 'Tigrão', arrival: '2020', birth: '2020', sex: 'm' },
  { name: 'Romeu', arrival: '2020', birth: '2020', sex: 'm' },
  { name: 'Nala', arrival: '2021', birth: '2020', sex: 'f' },
  { name: 'Lola', arrival: '2021', birth: '2021', sex: 'f' },
  { name: 'Simba', arrival: '2023', birth: '2023', sex: 'm' },
  { name: 'Chico', arrival: '2023', birth: '2023', sex: 'm' },
]

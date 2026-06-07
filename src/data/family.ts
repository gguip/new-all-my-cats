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

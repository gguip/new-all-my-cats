export type AttrKey = 'fome' | 'brincalhao' | 'dorminhoco' | 'ranzinza' | 'briguento'

export interface Attr {
  key: AttrKey
  color: string
}

export type Cat = { name: string; memorial?: boolean } & Record<AttrKey, number>

export const ATTRS: Attr[] = [
  { key: 'fome', color: 'var(--attr-fome)' },
  { key: 'brincalhao', color: 'var(--attr-brincalhao)' },
  { key: 'dorminhoco', color: 'var(--attr-dorminhoco)' },
  { key: 'ranzinza', color: 'var(--attr-ranzinza)' },
  { key: 'briguento', color: 'var(--attr-briguento)' },
]

export const CATS: Cat[] = [
  // 2012
  { name: 'Nina', fome: 70, brincalhao: 50, dorminhoco: 80, ranzinza: 40, briguento: 20 },
  // 2013 - filha da Nina
  { name: 'Valentina', fome: 65, brincalhao: 60, dorminhoco: 75, ranzinza: 35, briguento: 25 },
  // 2018
  { name: 'Malu', fome: 80, brincalhao: 70, dorminhoco: 55, ranzinza: 30, briguento: 40 },
  { name: 'Bisteca', fome: 95, brincalhao: 45, dorminhoco: 60, ranzinza: 50, briguento: 55, memorial: true },
  // 2019
  { name: 'Amarela', fome: 60, brincalhao: 75, dorminhoco: 65, ranzinza: 25, briguento: 30 },
  { name: 'Preta', fome: 55, brincalhao: 40, dorminhoco: 70, ranzinza: 60, briguento: 45 },
  { name: 'Branca', fome: 50, brincalhao: 55, dorminhoco: 72, ranzinza: 45, briguento: 35 },
  { name: 'Narizinho', fome: 75, brincalhao: 65, dorminhoco: 50, ranzinza: 20, briguento: 25, memorial: true },
  { name: 'Fumaça', fome: 85, brincalhao: 35, dorminhoco: 90, ranzinza: 55, briguento: 60, memorial: true },
  // 2019 - filhos da Narizinho
  { name: 'Theo', fome: 90, brincalhao: 85, dorminhoco: 40, ranzinza: 30, briguento: 50 },
  { name: 'Pingo', fome: 70, brincalhao: 90, dorminhoco: 35, ranzinza: 15, briguento: 45 },
  { name: 'Nevasca', fome: 55, brincalhao: 80, dorminhoco: 60, ranzinza: 25, briguento: 30 },
  { name: 'Lily', fome: 60, brincalhao: 95, dorminhoco: 45, ranzinza: 10, briguento: 20, memorial: true },
  // 2021
  { name: 'Salem', fome: 65, brincalhao: 50, dorminhoco: 55, ranzinza: 85, briguento: 70 },
  { name: 'Lebron', fome: 88, brincalhao: 75, dorminhoco: 50, ranzinza: 35, briguento: 65, memorial: true },
  { name: 'Bigode', fome: 72, brincalhao: 60, dorminhoco: 68, ranzinza: 40, briguento: 55 },
  // 2021 - irmãos
  { name: 'Cleiton', fome: 78, brincalhao: 55, dorminhoco: 62, ranzinza: 70, briguento: 75 },
  { name: 'Maju', fome: 58, brincalhao: 88, dorminhoco: 48, ranzinza: 20, briguento: 35 },
  { name: 'Manu', fome: 62, brincalhao: 82, dorminhoco: 52, ranzinza: 28, briguento: 40, memorial: true },
  // 2022 - irmão da Preta e Branca
  { name: 'Geraldo', fome: 68, brincalhao: 45, dorminhoco: 78, ranzinza: 65, briguento: 50 },
  { name: 'Pedrita', fome: 55, brincalhao: 70, dorminhoco: 60, ranzinza: 30, briguento: 25 },
  // 2023
  { name: 'Alice', fome: 60, brincalhao: 85, dorminhoco: 45, ranzinza: 15, briguento: 20 },
  { name: 'Romeo', fome: 75, brincalhao: 80, dorminhoco: 50, ranzinza: 25, briguento: 45 },
]

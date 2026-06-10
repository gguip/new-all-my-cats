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
  { name: 'Nina', fome: 40, brincalhao: 20, dorminhoco: 100, ranzinza: 0, briguento: 10 },
  // 2013 - filha da Nina
  { name: 'Valentina', fome: 75, brincalhao: 0, dorminhoco: 75, ranzinza: 95, briguento: 25 },
  // 2018
  { name: 'Malu', fome: 50, brincalhao: 40, dorminhoco: 70, ranzinza: 35, briguento: 25 },
  { name: 'Bisteca', fome: 80, brincalhao: 45, dorminhoco: 60, ranzinza: 80, briguento: 55, memorial: true },
  // 2019
  { name: 'Amarela', fome: 30, brincalhao: 45, dorminhoco: 45, ranzinza: 55, briguento: 65 },
  { name: 'Preta', fome: 65, brincalhao: 65, dorminhoco: 45, ranzinza: 75, briguento: 80 },
  { name: 'Branca', fome: 70, brincalhao: 65, dorminhoco: 55, ranzinza: 75, briguento: 90 },
  { name: 'Narizinho', fome: 60, brincalhao: 55, dorminhoco: 55, ranzinza: 60, briguento: 70, memorial: true },
  { name: 'Fumaça', fome: 45, brincalhao: 60, dorminhoco: 40, ranzinza: 20, briguento: 15, memorial: true },
  // 2019 - filhos da Narizinho
  { name: 'Theo', fome: 80, brincalhao: 20, dorminhoco: 50, ranzinza: 55, briguento: 80 },
  { name: 'Pingo', fome: 35, brincalhao: 70, dorminhoco: 45, ranzinza: 30, briguento: 45 },
  { name: 'Nevasca', fome: 80, brincalhao: 20, dorminhoco: 25, ranzinza: 80, briguento: 70 },
  { name: 'Lily', fome: 55, brincalhao: 35, dorminhoco: 40, ranzinza: 55, briguento: 55, memorial: true },
  // 2021
  { name: 'Salem', fome: 55, brincalhao: 30, dorminhoco: 35, ranzinza: 100, briguento: 75 },
  { name: 'Lebron', fome: 70, brincalhao: 55, dorminhoco: 45, ranzinza: 20, briguento: 30, memorial: true },
  { name: 'Bigode', fome: 80, brincalhao: 55, dorminhoco: 20, ranzinza: 20, briguento: 20 },
  // 2021 - irmãos
  { name: 'Cleiton', fome: 100, brincalhao: 40, dorminhoco: 40, ranzinza: 60, briguento: 85 },
  { name: 'Maju', fome: 65, brincalhao: 20, dorminhoco: 30, ranzinza: 60, briguento: 65 },
  { name: 'Manu', fome: 55, brincalhao: 40, dorminhoco: 20, ranzinza: 55, briguento: 55, memorial: true },
  // 2022 - irmão da Preta e Branca
  { name: 'Geraldo', fome: 20, brincalhao: 20, dorminhoco: 40, ranzinza: 60, briguento: 80 },
  { name: 'Pedrita', fome: 60, brincalhao: 15, dorminhoco: 65, ranzinza: 20, briguento: 10 },
  // 2023
  { name: 'Alice', fome: 75, brincalhao: 45, dorminhoco: 35, ranzinza: 75, briguento: 85 },
  { name: 'Romeo', fome: 65, brincalhao: 40, dorminhoco: 55, ranzinza: 60, briguento: 75 },
]

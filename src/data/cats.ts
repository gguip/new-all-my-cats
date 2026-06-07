export type AttrKey = 'fome' | 'brincalhao' | 'dorminhoco' | 'ranzinza' | 'briguento'

export interface Attr {
  key: AttrKey
  color: string
}

export type Cat = { name: string } & Record<AttrKey, number>

export const ATTRS: Attr[] = [
  { key: 'fome', color: 'var(--attr-fome)' },
  { key: 'brincalhao', color: 'var(--attr-brincalhao)' },
  { key: 'dorminhoco', color: 'var(--attr-dorminhoco)' },
  { key: 'ranzinza', color: 'var(--attr-ranzinza)' },
  { key: 'briguento', color: 'var(--attr-briguento)' },
]

export const CATS: Cat[] = [
  { name: 'Mingau', fome: 85, brincalhao: 40, dorminhoco: 92, ranzinza: 30, briguento: 15 },
  { name: 'Biscoito', fome: 95, brincalhao: 70, dorminhoco: 45, ranzinza: 20, briguento: 35 },
  { name: 'Frajola', fome: 50, brincalhao: 85, dorminhoco: 35, ranzinza: 25, briguento: 60 },
  { name: 'Amora', fome: 40, brincalhao: 60, dorminhoco: 75, ranzinza: 55, briguento: 20 },
  { name: 'Nina', fome: 65, brincalhao: 90, dorminhoco: 30, ranzinza: 15, briguento: 45 },
  { name: 'Tom', fome: 70, brincalhao: 55, dorminhoco: 60, ranzinza: 40, briguento: 80 },
  { name: 'Salem', fome: 45, brincalhao: 35, dorminhoco: 50, ranzinza: 92, briguento: 70 },
  { name: 'Bóris', fome: 88, brincalhao: 50, dorminhoco: 65, ranzinza: 60, briguento: 55 },
  { name: 'Maju', fome: 55, brincalhao: 95, dorminhoco: 25, ranzinza: 10, briguento: 30 },
  { name: 'Pipoca', fome: 60, brincalhao: 80, dorminhoco: 40, ranzinza: 35, briguento: 50 },
  { name: 'Tigrão', fome: 75, brincalhao: 65, dorminhoco: 45, ranzinza: 50, briguento: 92 },
  { name: 'Romeu', fome: 50, brincalhao: 45, dorminhoco: 88, ranzinza: 30, briguento: 20 },
  { name: 'Jujuba', fome: 80, brincalhao: 72, dorminhoco: 55, ranzinza: 25, briguento: 40 },
  { name: 'Bidu', fome: 35, brincalhao: 50, dorminhoco: 95, ranzinza: 45, briguento: 15 },
  { name: 'Nala', fome: 60, brincalhao: 85, dorminhoco: 35, ranzinza: 20, briguento: 55 },
  { name: 'Simba', fome: 90, brincalhao: 75, dorminhoco: 40, ranzinza: 30, briguento: 65 },
  { name: 'Chico', fome: 55, brincalhao: 40, dorminhoco: 70, ranzinza: 78, briguento: 50 },
  { name: 'Lola', fome: 65, brincalhao: 60, dorminhoco: 62, ranzinza: 40, briguento: 35 },
]

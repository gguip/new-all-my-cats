// Dados reais da família de gatos. Organizados por ANO DE CHEGADA.
// Gatas que tiveram filhotes: Nina (mãe da Valentina) e Narizinho (mãe de Theo, Pingo, Nevasca, Lily).
// Preta, Branca e Geraldo são irmãos. Cleiton, Maju e Manu são irmãos.
export type Sex = 'f' | 'm' | 'x'

export interface FamilyCat {
  name: string // join key com CATS[].name
  arrival: string // ano de chegada na família
  birth?: string // ano de nascimento (opcional)
  sex: Sex
  momName?: string // apenas para filhotes nascidos na casa
  memorial?: boolean // gatos que já partiram
}

export const FAMILY: FamilyCat[] = [
  // 2012 - A primeira gatinha
  { name: 'Nina', arrival: '2012', sex: 'f' },

  // 2013 - Filha da Nina
  { name: 'Valentina', arrival: '2013', birth: '2013', sex: 'f', momName: 'Nina' },

  // 2018
  { name: 'Malu', arrival: '2018', sex: 'f' },
  { name: 'Bisteca', arrival: '2018', sex: 'm', memorial: true },

  // 2019 - Chegadas
  { name: 'Amarela', arrival: '2019', sex: 'f' },
  { name: 'Preta', arrival: '2019', sex: 'f' }, // irmã da Branca e Geraldo
  { name: 'Branca', arrival: '2019', sex: 'f' }, // irmã da Preta e Geraldo
  { name: 'Narizinho', arrival: '2019', sex: 'f', memorial: true }, // mãe de Theo, Pingo, Nevasca, Lily
  { name: 'Fumaça', arrival: '2019', sex: 'f', memorial: true },

  // 2019 - Filhotes da Narizinho
  { name: 'Theo', arrival: '2019', birth: '2019', sex: 'm', momName: 'Narizinho' },
  { name: 'Pingo', arrival: '2019', birth: '2019', sex: 'm', momName: 'Narizinho' },
  { name: 'Nevasca', arrival: '2019', birth: '2019', sex: 'f', momName: 'Narizinho' },
  { name: 'Lily', arrival: '2019', birth: '2019', sex: 'f', momName: 'Narizinho', memorial: true },

  // 2021
  { name: 'Salem', arrival: '2021', sex: 'm' },
  { name: 'Lebron', arrival: '2021', sex: 'm', memorial: true },
  { name: 'Bigode', arrival: '2021', sex: 'm' },

  // 2021 - Irmãos
  { name: 'Cleiton', arrival: '2021', sex: 'm' },
  { name: 'Maju', arrival: '2021', sex: 'f' },
  { name: 'Manu', arrival: '2021', sex: 'f', memorial: true },

  // 2022 - Geraldo voltou (irmão da Preta e Branca)
  { name: 'Geraldo', arrival: '2022', sex: 'm' },
  { name: 'Pedrita', arrival: '2022', sex: 'f' },

  // 2023
  { name: 'Alice', arrival: '2023', sex: 'f' },
  { name: 'Romeo', arrival: '2023', sex: 'm' },
]

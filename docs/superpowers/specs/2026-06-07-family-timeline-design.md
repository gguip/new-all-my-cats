# Família: Timeline por Ano de Chegada (mix árvore + linha do tempo)

**Data:** 2026-06-07
**Rota:** `/familia`
**Status:** Aprovado, pronto pra plano de implementação

## Problema

A página `/familia` hoje renderiza uma árvore genealógica **inventada**: uma dinastia de 4 gerações descendendo de Mingau & Tom (`src/data/family.ts`). A realidade é outra:

- A maioria dos gatos chegou sem parentesco com os demais.
- Só **2 gatas** tiveram ninhada.
- Os filhotes foram castrados → o galho morre ali (sem netos).

Uma árvore grande é a estrutura errada: quase todo gato seria uma "raiz solta". O modelo certo é uma **linha do tempo por ano de chegada**, onde os poucos laços de parentesco (mãe→ninhada) aparecem encaixados no ponto certo do tempo.

## Conceito

Página vira **timeline vertical por ano de chegada** (scroll, sem pan/zoom):

- Cada ano = uma seção/bucket.
- Gatos que chegaram naquele ano = cards individuais.
- As 2 ninhadas reais = caixa **"filhos de {nome}"** no bucket do ano em que os filhotes **nasceram** (não no ano da mãe).

Decisões travadas no brainstorm:

| Decisão | Escolha |
|---|---|
| Eixo principal | Timeline manda |
| Base do tempo | Ano de chegada na família |
| Layout | Seções por ano (buckets) |
| Ancoragem da ninhada | Filhotes no bucket do ano de nascimento, rotulados "filhos de X" (timeline honesta) |
| Parentesco no modelo | Só mãe→ninhada (sem pai, sem parceiro) |
| Card de detalhe | Detalhe família + barras de personalidade (`cats.ts`) |
| Escala | ~10-20 gatos, poucos anos |

## Modelo de dados

`src/data/family.ts` é reescrito. Liga ao roster real (`cats.ts`) **pelo nome**.

```ts
export type Sex = 'f' | 'm' | 'x'

export interface FamilyCat {
  name: string      // chave de join com CATS[].name
  arrival: string   // ano de chegada — eixo da timeline ('' se desconhecido)
  birth?: string    // ano de nascimento (opcional)
  sex: Sex
  momName?: string  // setado só nos filhotes das 2 ninhadas
}
```

Removido do modelo antigo: `id` numérico, `dadId`, `partnerId`, `momId` (vira `momName`).

**Dados reais:** os anos de chegada reais e a identidade das 2 mães + seus filhotes são preenchidos pelo dono depois. Até lá, ficam valores plausíveis derivados do roster atual de `cats.ts`. Isso é tarefa de entrada de dados, não bloqueia a implementação.

## Lógica de layout — `src/lib/familyTimeline.ts` (novo)

Função pura, sem dependência de Vue, testável com TDD.

Entrada: `FamilyCat[]`. Saída:

```ts
export interface Litter {
  momName: string
  birth: string        // ano de nascimento da ninhada
  kittens: FamilyCat[]
}
export interface YearBucket {
  year: string         // ano (ou marcador "sem data")
  cats: FamilyCat[]    // gatos sem mãe que chegaram nesse ano
  litters: Litter[]    // ninhadas nascidas nesse ano
}
export function buildTimeline(cats: FamilyCat[]): YearBucket[]
```

Regras:

1. Gato **sem** `momName` → vai pro bucket do seu `arrival`.
2. Gato **com** `momName` → agrupado em `Litter` (chave: `momName` + `birth`), e a ninhada vai pro bucket do `birth`.
3. `year` dos buckets = união dos anos de chegada (gatos sem mãe) + anos de nascimento (ninhadas).
4. Buckets ordenados por ano ascendente. Bucket "sem data" (ano vazio) vai pro fim.
5. Dentro do bucket, ordem dos cards: por nome (estável). Ninhadas após os cards individuais.

## Componentes

| Ação | Arquivo | Detalhe |
|---|---|---|
| Novo | `src/components/family/CatCard.vue` | Substitui `TreeNode.vue`. Mostra nome, sexo, ano relevante. Click → emite `select`. |
| Reescreve | `src/pages/FamilyTreePage.vue` | Loop de buckets; cada bucket lista cards + caixas de ninhada. Scroll vertical, sem canvas/transform. |
| Adapta | `src/components/family/TreeDetailPanel.vue` | Campos: chegada, nascimento, sexo, mãe/filhos + **barras de personalidade** (join com `cats.ts` por nome). |
| Mantém | `src/components/family/FamilyTopBar.vue` | Sem mudança (ou ajuste leve de título). |
| Remove | `src/lib/familyLayout.ts` | Tidy-tree obsoleto. |
| Remove | `src/lib/familyWires.ts` | Conectores SVG obsoletos. |
| Remove | `src/components/family/ZoomControls.vue` | Sem zoom. |
| Remove | `src/composables/useDragPan.ts` | Sem pan. |
| Remove | `src/components/family/TreeNode.vue` | Substituído por `CatCard.vue`. |
| Reescreve | `src/css/family.scss` | Layout de buckets (seções de ano, grade de cards, caixa de ninhada pontilhada). |

**Layout de rota:** `/familia` continua em `FullScreenLayout`, mas com scroll vertical habilitado (hoje é canvas full-screen). Ajustar o CSS do container.

## Fluxo de dados

```
family.ts (FamilyCat[])
   │  buildTimeline()
   ▼
YearBucket[] ──► FamilyTreePage (v-for buckets)
                     │ card click → selName: string|null
                     ▼
              TreeDetailPanel(name)
                     │ join por nome
                     ├─ FamilyCat (família)
                     └─ CATS[name] (personalidade)
```

Seleção passa a ser por `name: string | null` (não mais `id` numérico).

## i18n

`src/i18n/*`:

- **Adiciona:** `family.litterOf` ("filhos de {name}"), `family.yearLabel`, labels de personalidade (`family.attr.fome`, etc. — ou reusar de `cats.ts` se já houver), `family.noDate` ("sem data").
- **Remove:** `family.fDad`, `family.fPartner`, `family.hint`, `family.hintLabel` e demais strings de zoom/pan.

## Edge cases

- Gato em ninhada sem `birth` → cai na ninhada mesmo assim; ninhada sem ano vai pro bucket "sem data".
- `arrival` vazio (gato sem mãe) → bucket "sem data" no fim.
- Nome em `family.ts` sem match em `cats.ts` → painel renderiza sem barras de personalidade (graceful, sem erro).
- Mãe e ninhada em anos diferentes → mãe no bucket de chegada dela; filhotes no bucket de nascimento (decisão de ancoragem B).
- Dois gatos com mesmo nome → não suportado; nomes são únicos (assunção do roster).

## Testes

`familyTimeline.ts` (TDD, função pura):

- Agrupa gatos sem mãe por ano de chegada.
- Coloca ninhada no bucket do ano de nascimento, não no da mãe.
- Agrupa filhotes da mesma mãe na mesma `Litter`.
- Ordena buckets ascendente; "sem data" no fim.
- Edge: gato sem `arrival`; ninhada sem `birth`.

Join family↔cats:

- Nome existente → retorna stats de personalidade.
- Nome ausente → retorna null/undefined sem lançar.

## Fora de escopo

- Página de perfil por gato (não existe; não criar).
- Edição de dados pela UI (dados são hardcoded em `family.ts`).
- Refactor de `cats.ts` além do necessário pro join.

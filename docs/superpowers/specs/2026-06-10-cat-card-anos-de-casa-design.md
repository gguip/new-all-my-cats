# Design: "anos de casa" nos cards dos gatos (home)

**Data:** 2026-06-10
**Status:** Aprovado (aguardando review do spec)

## Objetivo

Mostrar, na frente de cada card de gato na home, há quanto tempo o gato faz
parte da família — ao lado do nome.

## Contexto e restrição central

Os cards (`CatCard.vue`) renderizam a partir de `src/data/cats.ts`, que **não
tem nenhum dado de data**. As datas vivem em `src/data/family.ts`:

- `arrival` (ano de chegada) existe para **todos** os 23 gatos.
- `birth` (ano de nascimento) existe **apenas para os 5 gatos nascidos em casa**
  (Valentina, Theo, Pingo, Nevasca, Lily).

Como não sabemos o nascimento real da maioria, o card mostra **tempo de
convívio** ("anos de casa"), calculado a partir do `arrival` — único dado
consistente para todos. Não é idade biológica, e isso é intencional.

## Decisões tomadas (brainstorming)

- **O que mostrar:** anos com a família, a partir de `arrival`.
- **Redação:** "X anos de casa".
- **Posição:** na mesma linha do nome, alinhado à direita.
- **Card estreito:** pode quebrar para a linha de baixo quando faltar espaço.

## Arquitetura (Abordagem A — helper de join + função pura)

Fonte única de verdade: o `arrival` continua só em `family.ts`. Nada é
duplicado em `cats.ts`.

### Lógica de dados

- **Função pura** (testável):
  ```ts
  yearsHome(arrivalYear: number, currentYear: number): number
  // => Math.max(0, currentYear - arrivalYear)  // nunca negativo
  ```
- **Lookup por nome**, derivado de `FAMILY`:
  ```ts
  arrivalYearOf(name: string): number | undefined
  ```
  (constrói um mapa nome → Number(arrival) a partir de `FAMILY`)

### CatCard.vue

- Importa o lookup + `yearsHome`.
- Resolve `arrival` pelo `props.cat.name`; calcula `years` com
  `new Date().getFullYear()` como `currentYear`.
- Se o gato não tiver entrada em `FAMILY` (não ocorre hoje), o rótulo
  simplesmente não é renderizado (`v-if`).

### Apresentação

- Rótulo na mesma linha do `<h4>` do nome (nome à esquerda, rótulo à direita).
- Fonte menor, cor suave/mutada (tom `--tan`/neutro do tema), peso normal.
- Em largura insuficiente, o rótulo quebra para a linha de baixo (graceful,
  via flex-wrap / layout que permita a quebra). Sem truncamento.

## i18n (pt-BR, en, es) — pluralização com 3 formas

Chave nova `cat.yearsHome`, usando pluralização do vue-i18n
(`0 → índice 0`, `1 → índice 1`, `n → índice 2`):

| Locale | Mensagem |
|--------|----------|
| pt-BR  | `recém-chegado \| {count} ano de casa \| {count} anos de casa` |
| en     | `just arrived \| {count} year with us \| {count} years with us` |
| es     | `recién llegado \| {count} año en casa \| {count} años en casa` |

Uso no componente: `t('cat.yearsHome', years, { count: years })`.

### Exemplos (ano atual = 2026)

- Nina (arrival 2012) → "14 anos de casa"
- Romeo (arrival 2023) → "3 anos de casa"
- Gato hipotético com 1 ano → "1 ano de casa" (singular)
- Gato que chegasse em 2026 → "recém-chegado"

## Testes (Vitest)

Cobrir a função pura `yearsHome`:

- caso normal: `yearsHome(2012, 2026) === 14`
- singular: `yearsHome(2025, 2026) === 1`
- recém-chegado: `yearsHome(2026, 2026) === 0`
- guarda contra futuro: `yearsHome(2030, 2026) === 0` (nunca negativo)

(Opcional) teste de `arrivalYearOf` para um nome conhecido e um inexistente.

## Fora de escopo (YAGNI)

- Idade biológica real para gatos não nascidos em casa.
- Preencher `birth` faltante.
- Mostrar o rótulo em outros lugares além do card da home.

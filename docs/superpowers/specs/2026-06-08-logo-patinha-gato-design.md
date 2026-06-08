# Logo: blob de nuvem → patinha de gato

**Data:** 2026-06-08
**Status:** Aprovado

## Objetivo

Trocar a logo atual (blob de nuvem cream atrás do texto "Catastrophe") por uma
pegada de gato ao lado do texto. Reaproveitar SVG de pata já existente no código,
sem busca externa.

## Decisões

- **Forma:** `PawPrint` existente — pegada clássica de 4 dedos + coxim, plana, 1 cor.
- **Lockup:** texto "Catastrophe" primeiro, ícone da pata à direita (linha).
- **Cor:** `var(--olive)` via `currentColor` (herda do `.logo`).
- **Renomear:** componente `LogoBlob` → `LogoMark` (não é mais blob; `LogoMark`
  e não `Logo` por causa da regra eslint `vue/multi-word-component-names`).
- **Footer:** `.footer .logo` muda de `var(--olive)` → `var(--cream-text)`, senão
  a logo (agora cor única herdada) fica invisível no fundo olive do footer.

## Estado atual

- `src/components/Illustrations.ts:3` — `LogoBlob`: `<div.logo>` com `<svg>` de 8
  círculos (`fill: var(--cream)`) + `<span>Catastrophe</span>`.
- `src/css/app.scss:100` — `.logo`: coluna, `width:96px height:84px`,
  `color:var(--olive)`. `.logo svg` é `position:absolute; inset:0` (fica ATRÁS
  do texto, z-index 1; texto z-index 2).
- Usado em 3 sites, todos via `<LogoBlob />` + classe `.logo`:
  - `src/components/AppNav.vue:48`
  - `src/components/family/FamilyTopBar.vue:11`
  - `src/components/ContactFooter.vue:42`
- `PawPrint` (linha 25) e `PawPad` (linha 40) seguem intactos.

## Mudanças

### 1. `src/components/Illustrations.ts`

Reescrever `LogoBlob` como `LogoMark`:

- `name: 'Logo'`, export `const Logo`.
- Render: `<div.logo>` contendo, nesta ordem:
  1. `<span>Catastrophe</span>`
  2. `<svg>` da pata: `viewBox '0 0 40 40'`, `fill: 'currentColor'`,
     `aria-hidden`, com as 5 elipses do `PawPrint`:
     - `ellipse cx20 cy27 rx11 ry9`
     - `ellipse cx8.5 cy17 rx4.2 ry5`
     - `ellipse cx16 cy10 rx4.2 ry5`
     - `ellipse cx24 cy10 rx4.2 ry5`
     - `ellipse cx31.5 cy17 rx4.2 ry5`

### 2. `src/css/app.scss` `.logo` (linha ~100)

- `flex-direction: row`, `gap: 8px`, `align-items: center`, `justify-content: center`.
- `width: auto`, remover/ajustar `height` fixo.
- `.logo svg`: remover `position:absolute; inset:0; width:100%; height:100%`.
  Virar ícone inline com largura fixa (~26–28px).
- `.logo span`: remover `position:relative; z-index:2` (não há mais sobreposição).
- Manter `color:var(--olive)`, `font-family:var(--font-display)`, peso, drop-shadow.

### 3. Sites de uso (3 arquivos)

Trocar import e tag `LogoBlob` → `LogoMark`:

- `src/components/AppNav.vue` (import linha 5, uso linha 48)
- `src/components/family/FamilyTopBar.vue` (import + uso linha 11)
- `src/components/ContactFooter.vue` (import + uso linha 42)

Markup inalterado fora do nome do componente.

## Fora de escopo

- `PawPrint` e `PawPad` (usados em outros lugares) permanecem.
- Sem busca de SVG externo / icon set.
- Sem mudança de paleta, fontes ou texto da marca.

## Verificação

- Logo aparece como "Catastrophe" + pegada olive à direita nos 3 sites.
- Sem referência sobrando a `LogoBlob` (`grep -rn LogoBlob src/` = vazio).
- Build/typecheck passa.

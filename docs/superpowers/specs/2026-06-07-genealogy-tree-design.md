# AllMyCats — Genealogy Tree Page

**Date:** 2026-06-07
**Status:** Approved (design)

## Overview

A full-screen "family tree" page showing the 18 cats arranged as a multi-generation
dynasty. Pannable/scrollable canvas with SVG connectors (parent→child and
partner links), zoom, and a read-only detail panel when a cat is clicked. The
tree is **hardcoded** — no add/edit/delete/restore/persistence (the source design
had those; they are intentionally removed).

Design source: `/Users/guilhermepassarinho/Downloads/Arvore Genealogica dos Gatos.html`
(a packed React prototype). The decoded prototype provided the canonical CSS, the
sample dynasty data (`DEFAULT_TREE`), the pure layout engine (`AMC_layout.layoutTree`),
and the wire-builder (`buildWires`) — all ported here.

## Decisions (locked)

- **Data:** use the design's dynasty, hardcoded. 18 cats, 4 generations descending
  from Mingau & Tom, with partners marrying in. Editable later in a data file.
- **Node click:** highlight (orange border) + a **read-only** detail panel showing
  name, birth year, sex, mother, father, partner (names resolved).
- **Integration:** standalone full-screen route `/familia`, own top bar with a
  "back to site" link; a "Família/Family" link is added to the main site nav.
- **Keep:** internal scroll (`.stage{overflow:auto}` — the lateral scroll),
  drag-to-pan, zoom +/−, SVG wires.
- **Remove:** add cat, restore-example, edit panel, delete, localStorage.
- Out of scope: real photos, animation beyond the existing reveal/transitions,
  editing of any kind.

## Stack

Reuses the existing project (Quasar Vite SPA, Vue 3 `<script setup>`, TypeScript,
vue-i18n, Vitest). Brand tokens already present in `src/css/tokens/*`.

## Structure

```
src/
  data/family.ts                 # FamilyCat type + FAMILY (18, the dynasty)
  lib/familyLayout.ts            # pure tidy-tree layout (port of AMC_layout)
  lib/familyWires.ts             # pure buildWires(layout) -> { parent[], partner[] }
  composables/useDragPan.ts      # pointer drag on stage -> scrollLeft/scrollTop
  css/family.scss                # tree-specific CSS (tbar/stage/canvas/node/wires/panel/zoom)
  layouts/FullScreenLayout.vue   # minimal full-screen layout (no AppNav)
  pages/FamilyTreePage.vue       # composition + state (selId, zoom) + pan wiring
  components/family/
    FamilyTopBar.vue             # brand + back-to-site link
    TreeNode.vue                 # one .node (photo/name/sexdot/birth), emits select
    TreeDetailPanel.vue          # read-only panel (name/birth/sex/mom/dad/partner)
    ZoomControls.vue             # +/- buttons
  router/routes.ts               # add /familia -> FullScreenLayout -> FamilyTreePage
  components/AppNav.vue          # add Família/Family nav link (router-link /familia)
  i18n/{en,pt-BR}.ts             # family.* keys + nav.family
test/unit/
  familyLayout.test.ts
  familyWires.test.ts
  useDragPan.test.ts
```

## Data shape

```ts
// src/data/family.ts
export type Sex = 'f' | 'm' | 'x'
export interface FamilyCat {
  id: number
  name: string
  birth: string          // year, e.g. '2014' ('' if unknown)
  sex: Sex
  momId: number | null
  dadId: number | null
  partnerId: number | null
}
export const FAMILY: FamilyCat[] = [ /* 18 cats from the design's DEFAULT_TREE */ ]
```

The 18 entries are the design's `DEFAULT_TREE` verbatim (ids 1–18; founders Mingau
id1 + Tom id2; gen1 Biscoito/Amora/Frajola + spouses Nina/Bóris/Maju; gen2
Tigrão/Pipoca/Romeu/Bidu/Jujuba + spouses Nala/Lola/Salem; gen3 Simba/Chico).

## Layout engine (`familyLayout.ts`)

Pure functions ported from `AMC_layout` (no DOM/React). Constants: `NODE_W=116`,
`COUPLE_GAP=30`, `SIB_GAP=50`, `ROOT_GAP=90`, `GEN_H=210`, `PAD=80`.

- `computeGen(cats)` — generation index per cat from mom/dad depth; partners
  equalised to the deeper generation (6 passes); cycle-guarded.
- `buildBlocks(cats)` — group into blocks: a couple = 2 adults (blood adult first),
  else a single.
- `layoutTree(cats)` returns `{ pos: Record<id,{x,y}>, gen, blocks, kidsOf, byId,
  width, height }`. Children placed under their parent couple (tidy recursive
  placement, centering parents over kids), roots laid left→right, normalised to
  `PAD` origin.

## Wires (`familyWires.ts`)

`buildWires(layout)` ports the prototype's connector math → `{ parent: string[],
partner: string[] }` (SVG path `d` strings). Constants `NODE_W=116`, `NODE_H=156`.
- partner: horizontal segment between the two adults of a couple.
- parent: from couple mid-bottom down to a horizontal "bus", then down to each
  child's blood-adult anchor top.

Rendered as `<path class="wire">` (parent, olive) and `<path class="wire wire--partner">`
(partner, orange dashed) inside `<svg class="wires">`.

## Components & behavior

- **FamilyTreePage** — root `.family-root` (`height:100vh; display:flex; column;
  overflow:hidden`). Holds `selId` (number|null), `zoom` (0.5–1.6, step 0.15).
  `layout = layoutTree(FAMILY)` (computed once), `wires = buildWires(layout)`.
  Renders FamilyTopBar, `.stage` (ref, `overflow:auto`, click-empty clears selId)
  → `.canvas` (`width/height` from layout, `transform: scale(zoom)`) → wires SVG +
  one TreeNode per cat (positioned `left/top` from `layout.pos`). Plus hintchip,
  ZoomControls, and TreeDetailPanel (open when selId set). Drag-to-pan via
  `useDragPan(stageRef)`.
- **FamilyTopBar** — olive `.tbar`: paw-pad logo + title "Árvore Genealógica" /
  subtitle, spacer, "← Voltar ao site" link (`router-link to="/"`). No add/restore.
- **TreeNode** — `.node` (absolute `left/top` via props), photo placeholder circle
  (mono tag), `.sexdot` (sex-f pink / sex-m blue / sex-x sage) + name, birth line.
  `.sel` class when selected. Emits `select(id)` on click (stops propagation).
- **TreeDetailPanel** — read-only `.panel.open` when a cat is selected: header
  "Detalhes" + close ×; fields Nome, Nascimento, Sexo (label), Mãe, Pai,
  Parceiro(a) (resolved to names via `byId`, "—" when null). No inputs, no delete.
- **ZoomControls** — `.zoom` with +/− buttons adjusting `zoom`.
- **useDragPan(stageRef)** — pointerdown on empty canvas (not on `.node`) starts a
  drag that sets `stage.scrollLeft/scrollTop` from the delta; toggles `grabbing`
  cursor; cleans listeners on unmount.

## CSS (`family.scss`)

Port the prototype's genealogy CSS (`.tbar`, `.tbtn`, `.stage`, `.canvas`,
`.wires`/`.wire`/`.wire--partner`, `.node` + parts, `.sexdot`/`.sex-*`, `.panel`
+ fields (read-only subset), `.hintchip`, `.zoom`, responsive ≤620px). Uses the
existing brand CSS variables. **Do not** set `body{overflow:hidden}` globally —
scope full-screen sizing to `.family-root`. Imported once (via `app.scss` or the
page); class names are namespaced so global import is safe.

## Routing & nav

- `routes.ts`: add a route `{ path: '/familia', component: FullScreenLayout,
  children: [{ path: '', component: FamilyTreePage }] }` (keep existing `/` and
  catch-all).
- `FullScreenLayout.vue`: just `<router-view />` (no AppNav, no chrome).
- `AppNav.vue`: add a nav link to `/familia` (label `nav.family`) using
  `router-link`. The existing in-page anchor links stay; this one navigates routes.

## i18n

Add to both `en.ts` and `pt-BR.ts`:
- `nav.family` — "Family" / "Família"
- `family.title` — "Family Tree" / "Árvore Genealógica"
- `family.subtitle` — "The cat dynasty" / "A dinastia dos gatos"
- `family.back` — "Back to site" / "Voltar ao site"
- `family.hint` — "Click a cat for details. Drag the background to move the tree." /
  "Clique num gato para ver detalhes. Arraste o fundo para mover a árvore."
- `family.detail` — "Details" / "Detalhes"
- `family.fName/fBirth/fSex/fMom/fDad/fPartner` — Name/Birth/Sex/Mother/Father/Partner
  (PT: Nome/Nascimento/Sexo/Mãe/Pai/Parceiro(a))
- `family.sexF/sexM/sexX` — Female/Male/Unknown (PT: Fêmea/Macho/Desconhecido)
- `family.none` — "—"

Page uses global scope for any `tm` (none needed here; all flat keys via `t`).

## State

Local component state only (`selId`, `zoom`). No store, no persistence. Tree data
is a static import.

## Testing

Vitest, on the pure/logic units:
- `familyLayout.test.ts` — generation indices (founders gen 0, gen3 = 3); couple
  blocks (Mingau+Tom one block); every cat has a position; width/height > 0;
  partners share a generation row (equal `y`).
- `familyWires.test.ts` — returns parent + partner path arrays; partner count
  equals number of 2-adult blocks; parent paths non-empty for couples with kids.
- `useDragPan.test.ts` — pointerdown on canvas then pointermove updates the stage's
  scrollLeft/scrollTop by the inverse delta; pointerdown on a `.node` does not pan.

Static markup (nodes, panel) not unit-tested; verified via build + manual run.

## Build / env note

Project requires Node 22 for `quasar` commands (`.nvmrc` = 22.22.3). Tests/eslint
run on the project's Vitest. `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`
are on — index access into `pos`/`byId` must be guarded or asserted.

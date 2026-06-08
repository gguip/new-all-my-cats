# Family Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the invented genealogy tree on `/familia` with an arrival-year timeline (year buckets), rendering the 2 real litters as "filhos de X" boxes in their birth-year bucket.

**Architecture:** A pure layout function `buildTimeline` groups `FamilyCat[]` into year buckets (individual cats by arrival year, litters by birth year). `FamilyTreePage.vue` becomes a vertical scrolling list of buckets — no canvas, pan, or zoom. The detail panel joins `family.ts` to `cats.ts` by name to show personality bars (reusing `AttributeBar.vue`).

**Tech Stack:** Vue 3 (`<script setup>`), Quasar, vue-i18n, Vitest + @vue/test-utils (jsdom). Tests live in `test/unit/`, source paths use the `src/` alias.

**Spec:** `docs/superpowers/specs/2026-06-07-family-timeline-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/data/family.ts` | Rewritten data model: `FamilyCat { name, arrival, birth?, sex, momName? }` + roster data joined by name to `cats.ts`. |
| `src/lib/familyTimeline.ts` | NEW. Pure `buildTimeline()` → `YearBucket[]`. No Vue. |
| `src/components/family/TimelineCard.vue` | NEW. One cat card (name, sex dot, year). Named `Timeline*` to avoid clash with existing roster `src/components/CatCard.vue`. |
| `src/components/family/TreeDetailPanel.vue` | Adapted: name-based, shows mother/children + personality bars via `AttributeBar`. |
| `src/pages/FamilyTreePage.vue` | Rewritten: vertical buckets, no canvas/pan/zoom. |
| `src/css/family.scss` | Rewritten for bucket layout. |
| `src/i18n/pt-BR.ts`, `src/i18n/en.ts` | Add `litterOf`, `fChildren`, `noDate`, `personality`; remove `fDad`, `fPartner`, `hint`, `hintLabel`, `zoomIn`, `zoomOut`. |
| REMOVE: `src/lib/familyLayout.ts`, `src/lib/familyWires.ts`, `src/components/family/TreeNode.vue`, `src/components/family/ZoomControls.vue`, `src/composables/useDragPan.ts` | Obsolete tree/pan/zoom machinery. |
| REMOVE: `test/unit/familyLayout.test.ts`, `test/unit/familyWires.test.ts`, `test/unit/useDragPan.test.ts` | Tests for removed modules. |

**Note for executor:** Tasks 6–8 leave the app temporarily broken (page imports removed modules) only if run out of order. Follow task order; the cleanup in Task 8 happens after the page no longer imports the old modules (Task 6).

---

## Task 1: New data model (`family.ts`)

**Files:**
- Modify (full rewrite): `src/data/family.ts`

- [ ] **Step 1: Rewrite the data file**

Replace the entire contents of `src/data/family.ts` with:

```ts
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
```

- [ ] **Step 2: Typecheck the data file compiles**

Run: `npx vue-tsc --noEmit -p tsconfig.json 2>&1 | grep -E "family\.ts" || echo "no family.ts type errors"`
Expected: `no family.ts type errors` (errors in OTHER files that still import the old model are expected until later tasks — ignore those).

- [ ] **Step 3: Commit**

```bash
git add src/data/family.ts
git commit -m "feat(family): arrival-year data model, mother->litter only"
```

---

## Task 2: Timeline layout engine (`familyTimeline.ts`)

**Files:**
- Create: `src/lib/familyTimeline.ts`
- Test: `test/unit/familyTimeline.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/familyTimeline.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import type { FamilyCat } from 'src/data/family'
import { buildTimeline } from 'src/lib/familyTimeline'

const sample: FamilyCat[] = [
  { name: 'Mingau', arrival: '2016', birth: '2014', sex: 'f' },
  { name: 'Amora', arrival: '2017', birth: '2017', sex: 'f', momName: 'Mingau' },
  { name: 'Biscoito', arrival: '2017', birth: '2017', sex: 'm', momName: 'Mingau' },
  { name: 'Tom', arrival: '2016', birth: '2013', sex: 'm' },
  { name: 'Fantasma', arrival: '', sex: 'x' },
]

describe('buildTimeline', () => {
  it('groups motherless cats into their arrival-year bucket', () => {
    const buckets = buildTimeline(sample)
    const y2016 = buckets.find((b) => b.year === '2016')
    expect(y2016).toBeDefined()
    expect(y2016!.cats.map((c) => c.name).sort()).toEqual(['Mingau', 'Tom'])
  })

  it('puts a litter in the kittens birth-year bucket, not the mother year', () => {
    const buckets = buildTimeline(sample)
    const y2017 = buckets.find((b) => b.year === '2017')
    expect(y2017).toBeDefined()
    expect(y2017!.cats).toHaveLength(0) // no motherless arrivals in 2017
    expect(y2017!.litters).toHaveLength(1)
    expect(y2017!.litters[0]!.momName).toBe('Mingau')
    expect(y2017!.litters[0]!.kittens.map((k) => k.name).sort()).toEqual(['Amora', 'Biscoito'])
  })

  it('orders buckets ascending by year', () => {
    const buckets = buildTimeline(sample).map((b) => b.year).filter((y) => y !== '')
    expect(buckets).toEqual([...buckets].sort())
  })

  it('places the empty-year (no date) bucket last', () => {
    const buckets = buildTimeline(sample)
    expect(buckets[buckets.length - 1]!.year).toBe('')
    expect(buckets[buckets.length - 1]!.cats.map((c) => c.name)).toEqual(['Fantasma'])
  })

  it('sorts cats within a bucket by name', () => {
    const buckets = buildTimeline(sample)
    const y2016 = buckets.find((b) => b.year === '2016')!
    expect(y2016.cats.map((c) => c.name)).toEqual(['Mingau', 'Tom'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/familyTimeline.test.ts`
Expected: FAIL — `Failed to resolve import "src/lib/familyTimeline"` / `buildTimeline is not a function`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/familyTimeline.ts`:

```ts
import type { FamilyCat } from 'src/data/family'

export interface Litter {
  momName: string
  birth: string // birth year of the litter
  kittens: FamilyCat[]
}

export interface YearBucket {
  year: string // year, or '' for the "no date" bucket
  cats: FamilyCat[] // motherless cats that arrived this year
  litters: Litter[] // litters born this year
}

const byName = (a: FamilyCat, b: FamilyCat): number => a.name.localeCompare(b.name)

export function buildTimeline(cats: FamilyCat[]): YearBucket[] {
  const map = new Map<string, YearBucket>()
  const bucket = (year: string): YearBucket => {
    let b = map.get(year)
    if (!b) {
      b = { year, cats: [], litters: [] }
      map.set(year, b)
    }
    return b
  }

  // Motherless cats → arrival-year bucket.
  for (const c of cats) {
    if (c.momName) continue
    bucket(c.arrival).cats.push(c)
  }

  // Kittens → grouped into litters keyed by mom + birth, placed in birth bucket.
  const litterMap = new Map<string, Litter>()
  for (const c of cats) {
    if (!c.momName) continue
    const birth = c.birth ?? ''
    const key = c.momName + '|' + birth
    let lit = litterMap.get(key)
    if (!lit) {
      lit = { momName: c.momName, birth, kittens: [] }
      litterMap.set(key, lit)
      bucket(birth).litters.push(lit)
    }
    lit.kittens.push(c)
  }

  // Stable ordering inside buckets.
  for (const b of map.values()) {
    b.cats.sort(byName)
    for (const lit of b.litters) lit.kittens.sort(byName)
  }

  // Sort buckets ascending; the empty-year bucket sinks to the end.
  return [...map.values()].sort((a, b) => {
    if (a.year === '') return 1
    if (b.year === '') return -1
    return a.year.localeCompare(b.year)
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/unit/familyTimeline.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/familyTimeline.ts test/unit/familyTimeline.test.ts
git commit -m "feat(family): timeline bucket layout engine + tests"
```

---

## Task 3: i18n strings

**Files:**
- Modify: `src/i18n/pt-BR.ts` (the `family: { ... }` block)
- Modify: `src/i18n/en.ts` (the `family: { ... }` block)
- Test: `test/unit/i18n.test.ts` (add an assertion)

- [ ] **Step 1: Update the failing test first**

In `test/unit/i18n.test.ts`, add this test inside the `describe('i18n messages', ...)` block (after the `cat photo tag` test):

```ts
  it('builds the litterOf label with a name param', () => {
    locale.value = 'pt-BR'
    expect(t('family.litterOf', { name: 'Mingau' })).toBe('filhos de Mingau')
    locale.value = 'en'
    expect(t('family.litterOf', { name: 'Mingau' })).toBe('kittens of Mingau')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/i18n.test.ts`
Expected: FAIL — `family.litterOf` returns the key string, not the translated value.

- [ ] **Step 3: Update pt-BR family block**

In `src/i18n/pt-BR.ts`, replace the entire `family: { ... }` object with:

```ts
  family: {
    title: 'Linha do Tempo',
    subtitle: 'Como a turma foi chegando',
    back: 'Voltar ao site',
    detail: 'Detalhes',
    fName: 'Nome',
    fArrival: 'Chegada',
    fBirth: 'Nascimento',
    fSex: 'Sexo',
    fMom: 'Mãe',
    fChildren: 'Filhos',
    personality: 'Personalidade',
    litterOf: 'filhos de {name}',
    noDate: 'Sem data',
    sexF: 'Fêmea',
    sexM: 'Macho',
    sexX: 'Desconhecido',
    none: '—',
  },
```

- [ ] **Step 4: Update en family block**

In `src/i18n/en.ts`, replace the entire `family: { ... }` object with:

```ts
  family: {
    title: 'Timeline',
    subtitle: 'How the crew arrived',
    back: 'Back to site',
    detail: 'Details',
    fName: 'Name',
    fArrival: 'Arrival',
    fBirth: 'Birth',
    fSex: 'Sex',
    fMom: 'Mother',
    fChildren: 'Children',
    personality: 'Personality',
    litterOf: 'kittens of {name}',
    noDate: 'No date',
    sexF: 'Female',
    sexM: 'Male',
    sexX: 'Unknown',
    none: '—',
  },
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/unit/i18n.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/pt-BR.ts src/i18n/en.ts test/unit/i18n.test.ts
git commit -m "feat(family): i18n strings for timeline (litterOf, arrival, children)"
```

---

## Task 4: `TimelineCard.vue` component

**Files:**
- Create: `src/components/family/TimelineCard.vue`
- Test: `test/unit/TimelineCard.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/TimelineCard.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import TimelineCard from 'src/components/family/TimelineCard.vue'
import type { FamilyCat } from 'src/data/family'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })
const cat: FamilyCat = { name: 'Mingau', arrival: '2016', birth: '2014', sex: 'f' }

const mountCard = (props = {}) =>
  mount(TimelineCard, { props: { cat, ...props }, global: { plugins: [i18n] } })

describe('TimelineCard', () => {
  it('renders the cat name', () => {
    expect(mountCard().text()).toContain('Mingau')
  })

  it('emits select with the cat name on click', async () => {
    const w = mountCard()
    await w.trigger('click')
    expect(w.emitted('select')).toBeTruthy()
    expect(w.emitted('select')![0]).toEqual(['Mingau'])
  })

  it('reflects the selected state via aria-pressed', () => {
    const w = mountCard({ selected: true })
    expect(w.attributes('aria-pressed')).toBe('true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/TimelineCard.test.ts`
Expected: FAIL — `Failed to resolve import "src/components/family/TimelineCard.vue"`.

- [ ] **Step 3: Write the component**

Create `src/components/family/TimelineCard.vue`:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'

const props = defineProps<{
  cat: FamilyCat
  selected?: boolean
}>()
defineEmits<{ select: [name: string] }>()

const { t } = useI18n()
// The typed `t` rejects template-literal keys; loosen it for the photo tag.
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const sexCls = (s: FamilyCat['sex']) => (s === 'f' ? 'sex-f' : s === 'm' ? 'sex-m' : 'sex-x')
</script>

<template>
  <div
    class="tcard"
    :class="{ sel: props.selected }"
    role="button"
    tabindex="0"
    :aria-pressed="props.selected ? 'true' : 'false'"
    @click.stop="$emit('select', props.cat.name)"
    @keydown.enter.space.prevent.stop="$emit('select', props.cat.name)"
  >
    <div class="tcard__photo"><span>{{ td('cat.photoTag', { name: props.cat.name }) }}</span></div>
    <div class="tcard__name">
      <span class="sexdot" :class="sexCls(props.cat.sex)" />{{ props.cat.name || '—' }}
    </div>
    <div v-if="props.cat.birth" class="tcard__birth">{{ props.cat.birth }}</div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/unit/TimelineCard.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/family/TimelineCard.vue test/unit/TimelineCard.test.ts
git commit -m "feat(family): TimelineCard component + tests"
```

---

## Task 5: Adapt `TreeDetailPanel.vue` (name-based + personality)

**Files:**
- Modify (full rewrite): `src/components/family/TreeDetailPanel.vue`
- Test: `test/unit/TreeDetailPanel.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/TreeDetailPanel.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import TreeDetailPanel from 'src/components/family/TreeDetailPanel.vue'
import type { FamilyCat } from 'src/data/family'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })

const family: FamilyCat[] = [
  { name: 'Mingau', arrival: '2016', birth: '2014', sex: 'f' },
  { name: 'Amora', arrival: '2017', birth: '2017', sex: 'f', momName: 'Mingau' },
]

const mountPanel = (cat: FamilyCat | null) =>
  mount(TreeDetailPanel, { props: { cat, family }, global: { plugins: [i18n] } })

describe('TreeDetailPanel', () => {
  it('shows the cat name and arrival when open', () => {
    const w = mountPanel(family[1]!) // Amora
    expect(w.text()).toContain('Amora')
    expect(w.text()).toContain('Mingau') // mother
  })

  it('lists children for a mother', () => {
    const w = mountPanel(family[0]!) // Mingau
    expect(w.text()).toContain('Amora')
  })

  it('renders personality bars for a cat present in cats.ts', () => {
    const w = mountPanel(family[0]!) // Mingau exists in CATS
    expect(w.findAll('.stat').length).toBeGreaterThan(0)
  })

  it('renders no personality bars for an unknown cat', () => {
    const w = mountPanel({ name: 'Fantasma', arrival: '2020', sex: 'x' })
    expect(w.findAll('.stat').length).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/TreeDetailPanel.test.ts`
Expected: FAIL — current panel expects `byId` prop and `momId`/`dadId`/`partnerId` fields; assertions on children/personality fail.

- [ ] **Step 3: Rewrite the component**

Replace the entire contents of `src/components/family/TreeDetailPanel.vue` with:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'
import { CATS, ATTRS, type Cat } from 'src/data/cats'
import AttributeBar from 'src/components/AttributeBar.vue'

const props = defineProps<{
  cat: FamilyCat | null
  family: FamilyCat[]
}>()
defineEmits<{ close: [] }>()

const { t } = useI18n()
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const sexLabel = (s: FamilyCat['sex']): string =>
  s === 'f' ? t('family.sexF') : s === 'm' ? t('family.sexM') : t('family.sexX')

const children = computed<FamilyCat[]>(() =>
  props.cat ? props.family.filter((c) => c.momName === props.cat!.name) : [],
)

const stats = computed<Cat | null>(() =>
  props.cat ? (CATS.find((c) => c.name === props.cat!.name) ?? null) : null,
)
</script>

<template>
  <div class="panel" :class="{ open: props.cat }">
    <template v-if="props.cat">
      <div class="panel__head">
        <h3>{{ t('family.detail') }}</h3>
        <button class="panel__close" :aria-label="t('a11y.close')" @click="$emit('close')">×</button>
      </div>
      <div class="panel__body">
        <div class="field"><label>{{ t('family.fName') }}</label><p class="panel__val">{{ props.cat.name }}</p></div>
        <div class="field"><label>{{ t('family.fArrival') }}</label><p class="panel__val">{{ props.cat.arrival || t('family.none') }}</p></div>
        <div class="field"><label>{{ t('family.fBirth') }}</label><p class="panel__val">{{ props.cat.birth || t('family.none') }}</p></div>
        <div class="field"><label>{{ t('family.fSex') }}</label><p class="panel__val">{{ sexLabel(props.cat.sex) }}</p></div>
        <div class="field"><label>{{ t('family.fMom') }}</label><p class="panel__val">{{ props.cat.momName || t('family.none') }}</p></div>
        <div v-if="children.length" class="field">
          <label>{{ t('family.fChildren') }}</label>
          <p class="panel__val">{{ children.map((c) => c.name).join(', ') }}</p>
        </div>

        <template v-if="stats">
          <div class="panel__divider" />
          <label class="panel__section">{{ t('family.personality') }}</label>
          <AttributeBar
            v-for="(a, i) in ATTRS"
            :key="a.key"
            :label="td(`attrs.${a.key}`)"
            :value="stats[a.key]"
            :color="a.color"
            :live="true"
            :delay="i * 60"
          />
        </template>
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/unit/TreeDetailPanel.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/family/TreeDetailPanel.vue test/unit/TreeDetailPanel.test.ts
git commit -m "feat(family): detail panel by name with personality bars"
```

---

## Task 6: Rewrite `FamilyTreePage.vue`

**Files:**
- Modify (full rewrite): `src/pages/FamilyTreePage.vue`

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `src/pages/FamilyTreePage.vue` with:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FAMILY, type FamilyCat } from 'src/data/family'
import { buildTimeline } from 'src/lib/familyTimeline'
import FamilyTopBar from 'src/components/family/FamilyTopBar.vue'
import TimelineCard from 'src/components/family/TimelineCard.vue'
import TreeDetailPanel from 'src/components/family/TreeDetailPanel.vue'

const { t } = useI18n()
const buckets = buildTimeline(FAMILY)

const selName = ref<string | null>(null)
const selected = computed<FamilyCat | null>(() =>
  selName.value != null ? (FAMILY.find((c) => c.name === selName.value) ?? null) : null,
)

const yearLabel = (year: string): string => (year === '' ? t('family.noDate') : year)
</script>

<template>
  <div class="family-root">
    <FamilyTopBar />

    <div class="timeline" @click="selName = null">
      <section v-for="b in buckets" :key="b.year || 'nodate'" class="bucket">
        <h2 class="bucket__year">{{ yearLabel(b.year) }}</h2>

        <div class="bucket__cats">
          <TimelineCard
            v-for="c in b.cats"
            :key="c.name"
            :cat="c"
            :selected="c.name === selName"
            @select="selName = $event"
          />

          <div v-for="lit in b.litters" :key="lit.momName + lit.birth" class="litterbox">
            <span class="litterbox__label">{{ t('family.litterOf', { name: lit.momName }) }}</span>
            <div class="litterbox__cats">
              <TimelineCard
                v-for="k in lit.kittens"
                :key="k.name"
                :cat="k"
                :selected="k.name === selName"
                @select="selName = $event"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <TreeDetailPanel :cat="selected" :family="FAMILY" @close="selName = null" />
  </div>
</template>
```

- [ ] **Step 2: Verify the app builds (page no longer imports removed modules)**

Run: `npx vue-tsc --noEmit -p tsconfig.json 2>&1 | grep -E "FamilyTreePage|familyTimeline|TimelineCard|TreeDetailPanel" || echo "page typechecks clean"`
Expected: `page typechecks clean` (errors may still come from the now-orphaned old files — removed in Task 8).

- [ ] **Step 3: Commit**

```bash
git add src/pages/FamilyTreePage.vue
git commit -m "feat(family): rewrite page as scrolling year-bucket timeline"
```

---

## Task 7: Rewrite `family.scss`

**Files:**
- Modify (full rewrite): `src/css/family.scss`

- [ ] **Step 1: Inspect current selectors to preserve shared ones**

Run: `grep -nE "\.family-root|\.panel|\.sexdot|sex-f|sex-m|sex-x|\.stat" src/css/family.scss | head -40`
Expected: shows existing panel/sexdot/stat rules. Keep `.panel*`, `.sexdot`, `.sex-f/m/x`, and any `.stat*` rules referenced by `AttributeBar`/`TreeDetailPanel`; replace the canvas/node/wire/zoom rules with bucket layout.

- [ ] **Step 2: Read the full current stylesheet**

Run: `cat src/css/family.scss`
Expected: full contents printed. Identify the `.family-root`, `.stage`, `.canvas`, `.node`, `.wire`, `.hintchip`, zoom-control, and `.panel` sections.

- [ ] **Step 3: Rewrite the layout sections**

Edit `src/css/family.scss`: **remove** the `.stage`, `.canvas`, `.canvas__inner`, `.wires`/`.wire`, `.node*`, `.hintchip`, and zoom-control rules. **Keep** `.panel*`, `.sexdot`, `.sex-f/.sex-m/.sex-x`, `.field`, `.stat*`, and `.family-root` base. **Add** the timeline rules below (place them after the `.family-root` rule):

```scss
.timeline {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px 120px;
  overflow-y: auto;
}

.bucket {
  margin-bottom: 36px;
}

.bucket__year {
  font-size: 20px;
  font-weight: 700;
  opacity: 0.7;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 6px;
  margin: 0 0 16px;
}

.bucket__cats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.tcard {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 10px;
  width: 116px;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}
.tcard:hover,
.tcard:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  outline: none;
}
.tcard.sel {
  border-color: var(--orange);
  box-shadow: 0 0 0 2px var(--orange);
}
.tcard__photo {
  height: 70px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}
.tcard__name {
  font-weight: 600;
  font-size: 14px;
}
.tcard__birth {
  font-size: 12px;
  opacity: 0.55;
}

.litterbox {
  border: 2px dashed var(--attr-brincalhao, #a8e6cf);
  border-radius: 14px;
  padding: 10px 12px 12px;
}
.litterbox__label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  margin-bottom: 8px;
}
.litterbox__cats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.panel__section {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  margin: 4px 0 8px;
}
```

- [ ] **Step 4: Verify the full test suite still passes**

Run: `npx vitest run`
Expected: PASS for all remaining suites (familyTimeline, TimelineCard, TreeDetailPanel, i18n, CatCard, AttributeBar, FaqSection, useNavScroll, useScrollReveal). NOTE: `familyLayout.test.ts`, `familyWires.test.ts`, `useDragPan.test.ts` will FAIL here because their source still exists but the page no longer uses it — they are removed in Task 8. If only those three fail, proceed.

- [ ] **Step 5: Commit**

```bash
git add src/css/family.scss
git commit -m "feat(family): bucket timeline styles, drop canvas/node/zoom CSS"
```

---

## Task 8: Remove obsolete tree/pan/zoom modules

**Files:**
- Delete: `src/lib/familyLayout.ts`, `src/lib/familyWires.ts`, `src/components/family/TreeNode.vue`, `src/components/family/ZoomControls.vue`, `src/composables/useDragPan.ts`
- Delete: `test/unit/familyLayout.test.ts`, `test/unit/familyWires.test.ts`, `test/unit/useDragPan.test.ts`

- [ ] **Step 1: Confirm nothing still imports the modules to be removed**

Run: `grep -rnE "familyLayout|familyWires|useDragPan|TreeNode|ZoomControls" src/ test/ | grep -vE "test/unit/(familyLayout|familyWires|useDragPan)\.test\.ts" || echo "no remaining references"`
Expected: `no remaining references`. If anything prints (other than the three test files being deleted), fix that importer before deleting.

- [ ] **Step 2: Delete the files**

Run:
```bash
git rm src/lib/familyLayout.ts src/lib/familyWires.ts \
  src/components/family/TreeNode.vue src/components/family/ZoomControls.vue \
  src/composables/useDragPan.ts \
  test/unit/familyLayout.test.ts test/unit/familyWires.test.ts test/unit/useDragPan.test.ts
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, no failures, no missing-import errors.

- [ ] **Step 4: Typecheck the whole project**

Run: `npx vue-tsc --noEmit -p tsconfig.json`
Expected: exits 0, no errors.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(family): remove obsolete tree/pan/zoom modules and tests"
```

---

## Task 9: Manual verification

**Files:** none (runtime check)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Quasar serves the app (note the local URL).

- [ ] **Step 2: Verify `/familia` in the browser**

Open `/familia`. Confirm:
- Year sections render ascending (2016 → 2023).
- `Mingau` and `Tom` appear under 2016; the "filhos de Mingau" box (Amora, Biscoito) appears under 2017; "filhos de Maju" (Jujuba, Bidu) under 2019.
- Clicking a cat opens the detail panel with arrival/birth/sex/mother and personality bars.
- Clicking an unknown-to-`cats.ts` cat (if any) shows the panel without personality bars.
- No pan/zoom controls; the page scrolls vertically.

- [ ] **Step 3: Stop the server**

Stop the dev server (Ctrl+C).

---

## Self-Review Notes

- **Spec coverage:** model (T1), timeline engine (T2), i18n (T3), card (T4), detail+personality (T5), page (T6), styles (T7), removals (T8), edge cases covered by T2 tests (no-date bucket, litter birth-year anchoring) and T5 tests (unknown-cat graceful). ✅
- **Name clash avoided:** family card is `TimelineCard.vue`, not `CatCard.vue` (existing roster component). ✅
- **Type consistency:** `buildTimeline` → `YearBucket{year,cats,litters}`, `Litter{momName,birth,kittens}`; `selName: string|null`; `TreeDetailPanel` props `{cat, family}`; `TimelineCard` emits `select:[name]`. Used consistently across T2/T4/T5/T6. ✅
- **Reuse:** `AttributeBar.vue` and `attrs.<key>` i18n keys reused for personality. ✅

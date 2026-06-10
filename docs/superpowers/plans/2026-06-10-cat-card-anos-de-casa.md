# "Anos de casa" on Cat Cards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show how long each cat has been part of the family ("X anos de casa") next to the cat's name on the home page cards.

**Architecture:** A pure helper computes the number of years from a cat's arrival year (single source of truth: `FAMILY` in `src/data/family.ts`). `CatCard.vue` looks up the arrival year by name, computes the count against the current year, and renders an i18n label beside the name. The label wraps to a second line on narrow cards.

**Tech Stack:** Vue 3 (Composition API), Quasar 2, TypeScript (strict), vue-i18n, Vitest + Vue Test Utils, SCSS.

---

## File Structure

- **Create** `src/utils/yearsHome.ts` — pure `yearsHome(arrivalYear, currentYear)` + `arrivalYearOf(name)` lookup derived from `FAMILY`. One responsibility: date math + name→arrival join.
- **Create** `test/unit/yearsHome.test.ts` — unit tests for the pure helpers.
- **Modify** `src/i18n/pt-BR.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` — add three label strings under the existing `cat` block.
- **Modify** `src/components/CatCard.vue` — compute and render the age label.
- **Modify** `src/css/app.scss` — style `.cat-card__age` and allow `h4` to wrap.
- **Modify** `test/unit/CatCard.test.ts` — assert the age label renders for a known cat.

### i18n approach note

The spec describes the behavior with vue-i18n pipe-pluralization. This plan implements the **same visible behavior** with three explicit keys selected in JS (`justArrived` / `yearHome` / `yearsHome`). This reuses the named-interpolation pattern already proven in this codebase (`cat.photoTag` with `{name}`), is fully deterministic, and is trivial to test. Output text is identical to the spec.

---

## Task 1: Pure helper — `yearsHome` + `arrivalYearOf`

**Files:**
- Create: `src/utils/yearsHome.ts`
- Test: `test/unit/yearsHome.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/yearsHome.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { yearsHome, arrivalYearOf } from 'src/utils/yearsHome'

describe('yearsHome', () => {
  it('counts full years between arrival and current year', () => {
    expect(yearsHome(2012, 2026)).toBe(14)
  })

  it('returns 1 for a single year (singular case)', () => {
    expect(yearsHome(2025, 2026)).toBe(1)
  })

  it('returns 0 for a cat that arrived this year', () => {
    expect(yearsHome(2026, 2026)).toBe(0)
  })

  it('never returns a negative number for future arrivals', () => {
    expect(yearsHome(2030, 2026)).toBe(0)
  })
})

describe('arrivalYearOf', () => {
  it('returns the arrival year for a known cat', () => {
    expect(arrivalYearOf('Nina')).toBe(2012)
    expect(arrivalYearOf('Romeo')).toBe(2023)
  })

  it('returns undefined for an unknown name', () => {
    expect(arrivalYearOf('Mingau')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/yearsHome.test.ts`
Expected: FAIL — cannot resolve module `src/utils/yearsHome`.

- [ ] **Step 3: Write the helper**

Create `src/utils/yearsHome.ts`:

```ts
import { FAMILY } from 'src/data/family'

/** Full years a cat has been with the family. Never negative. */
export function yearsHome(arrivalYear: number, currentYear: number): number {
  return Math.max(0, currentYear - arrivalYear)
}

const ARRIVAL_BY_NAME: ReadonlyMap<string, number> = new Map(
  FAMILY.map((f) => [f.name, Number(f.arrival)]),
)

/** Arrival year for a cat by name, or undefined if not in FAMILY. */
export function arrivalYearOf(name: string): number | undefined {
  return ARRIVAL_BY_NAME.get(name)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/unit/yearsHome.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/yearsHome.ts test/unit/yearsHome.test.ts
git commit -m "feat(utils): yearsHome + arrivalYearOf helpers"
```

---

## Task 2: i18n strings (pt-BR, en, es)

**Files:**
- Modify: `src/i18n/pt-BR.ts` (the `cat:` block, ~line 41)
- Modify: `src/i18n/en.ts` (the `cat:` block, ~line 39)
- Modify: `src/i18n/es.ts` (the `cat:` block, ~line 41)

- [ ] **Step 1: Add keys to pt-BR**

In `src/i18n/pt-BR.ts`, replace the `cat` block:

```ts
  cat: {
    photoTag: 'foto de {name}',
    memorial: 'Para sempre em nossos corações ★',
  },
```

with:

```ts
  cat: {
    photoTag: 'foto de {name}',
    memorial: 'Para sempre em nossos corações ★',
    justArrived: 'recém-chegado',
    yearHome: '{count} ano de casa',
    yearsHome: '{count} anos de casa',
  },
```

- [ ] **Step 2: Add keys to en**

In `src/i18n/en.ts`, replace the `cat` block:

```ts
  cat: {
    photoTag: 'photo of {name}',
    memorial: 'Forever in our hearts ★',
  },
```

with:

```ts
  cat: {
    photoTag: 'photo of {name}',
    memorial: 'Forever in our hearts ★',
    justArrived: 'just arrived',
    yearHome: '{count} year with us',
    yearsHome: '{count} years with us',
  },
```

- [ ] **Step 3: Add keys to es**

In `src/i18n/es.ts`, replace the `cat` block:

```ts
  cat: {
    photoTag: 'foto de {name}',
    memorial: 'Por siempre en nuestros corazones ★',
  },
```

with:

```ts
  cat: {
    photoTag: 'foto de {name}',
    memorial: 'Por siempre en nuestros corazones ★',
    justArrived: 'recién llegado',
    yearHome: '{count} año en casa',
    yearsHome: '{count} años en casa',
  },
```

- [ ] **Step 4: Add an i18n parity test**

In `test/unit/i18n.test.ts`, add this test inside the `describe('i18n messages', ...)` block (after the `builds cat photo tag` test):

```ts
  it('builds the anos-de-casa label with a count param', () => {
    locale.value = 'pt-BR'
    expect(t('cat.yearHome', { count: 1 })).toBe('1 ano de casa')
    expect(t('cat.yearsHome', { count: 14 })).toBe('14 anos de casa')
    expect(t('cat.justArrived')).toBe('recém-chegado')
    locale.value = 'en'
    expect(t('cat.yearsHome', { count: 3 })).toBe('3 years with us')
  })
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run test/unit/i18n.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/pt-BR.ts src/i18n/en.ts src/i18n/es.ts test/unit/i18n.test.ts
git commit -m "feat(i18n): anos-de-casa labels in pt-BR/en/es"
```

---

## Task 3: Render the age label in CatCard

**Files:**
- Modify: `src/components/CatCard.vue`
- Modify: `test/unit/CatCard.test.ts`

- [ ] **Step 1: Write the failing test**

In `test/unit/CatCard.test.ts`, add a second cat and a test. After the existing `const cat = {...}` line (line 9), add:

```ts
const nina = { name: 'Nina', fome: 70, brincalhao: 50, dorminhoco: 80, ranzinza: 40, briguento: 20 }

function mountNina() {
  return mount(CatCard, { props: { cat: nina, attrs: ATTRS }, global: { plugins: [i18n] } })
}
```

Then add these tests inside the `describe('CatCard', ...)` block:

```ts
  it('shows anos-de-casa for a cat in FAMILY', () => {
    const expected = new Date().getFullYear() - 2012
    expect(mountNina().get('.cat-card__age').text()).toBe(`${expected} anos de casa`)
  })

  it('omits the age label for a cat not in FAMILY', () => {
    expect(mountCard().find('.cat-card__age').exists()).toBe(false)
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/CatCard.test.ts`
Expected: FAIL — `.cat-card__age` not found.

- [ ] **Step 3: Add the computed label to the script**

In `src/components/CatCard.vue`, update the imports at the top of `<script setup>`:

```ts
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
```

and add this import next to the other `src/data` import:

```ts
import { yearsHome, arrivalYearOf } from 'src/utils/yearsHome'
```

Then, after the `const td = ...` line (around line 16), add:

```ts
const ageLabel = computed<string | null>(() => {
  const arrival = arrivalYearOf(props.cat.name)
  if (arrival === undefined) return null
  const years = yearsHome(arrival, new Date().getFullYear())
  if (years === 0) return td('cat.justArrived')
  if (years === 1) return td('cat.yearHome', { count: 1 })
  return td('cat.yearsHome', { count: years })
})
```

- [ ] **Step 4: Render the label in the template**

In `src/components/CatCard.vue`, replace the `<h4>` block:

```html
    <h4>
      {{ props.cat.name }}
      <span v-if="props.cat.memorial" class="cat-card__star" :title="td('cat.memorial')">★</span>
    </h4>
```

with:

```html
    <h4>
      {{ props.cat.name }}
      <span v-if="props.cat.memorial" class="cat-card__star" :title="td('cat.memorial')">★</span>
      <span v-if="ageLabel" class="cat-card__age">{{ ageLabel }}</span>
    </h4>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/unit/CatCard.test.ts`
Expected: PASS (existing tests + the 2 new ones).

- [ ] **Step 6: Commit**

```bash
git add src/components/CatCard.vue test/unit/CatCard.test.ts
git commit -m "feat(cat-card): show anos-de-casa next to the name"
```

---

## Task 4: Style the age label

**Files:**
- Modify: `src/css/app.scss` (cat-card block, ~lines 182–189)

- [ ] **Step 1: Allow the h4 to wrap and add the age style**

In `src/css/app.scss`, replace line 182:

```scss
.cat-card h4{font-size:var(--fs-card-title);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
```

with:

```scss
.cat-card h4{font-size:var(--fs-card-title);margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
```

Then, right after the `.cat-card__star` rule (line 189), add:

```scss
.cat-card__age{margin-left:auto;font-size:var(--fs-label);font-weight:400;color:var(--body);opacity:.65;white-space:nowrap;}
```

`margin-left:auto` pushes the label to the right of the name; `flex-wrap:wrap` on the h4 lets it drop to its own line when the name leaves no room; `white-space:nowrap` keeps "14 anos de casa" intact rather than breaking mid-phrase.

- [ ] **Step 2: Verify the build and styles compile**

Run: `npm run lint`
Expected: no errors.

Run (manual visual check): `npm run dev` — open the home page, confirm the label sits to the right of each name and wraps below on a narrow window. Confirm "Mingau"-style cats not in FAMILY (none on the live page) is not relevant; every real cat shows a label.

- [ ] **Step 3: Commit**

```bash
git add src/css/app.scss
git commit -m "style(cat-card): anos-de-casa label, right-aligned with wrap"
```

---

## Task 5: Full verification

- [ ] **Step 1: Run the whole suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Production build sanity check**

Run: `npm run build`
Expected: build completes to `dist/spa/` with no type errors.

---

## Self-Review Notes

- **Spec coverage:** years-with-family from `arrival` (Task 1); wording "X anos de casa" + singular + "recém-chegado" (Task 2); label beside the name, right-aligned, wraps on narrow cards (Tasks 3–4); pt-BR/en/es (Task 2); pure-function tests incl. non-negative guard (Task 1); graceful omit when not in FAMILY (Task 3).
- **Current year** is read via `new Date().getFullYear()` in the component; the pure function stays date-free and deterministic. The CatCard test derives its expectation from the current year, so it won't rot across years.
- **No new global state**; matches the static-SPA architecture.

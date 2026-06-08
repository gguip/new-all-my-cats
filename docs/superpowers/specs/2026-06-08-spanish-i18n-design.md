# Add Spanish (ES) locale + persisted language selector

**Date:** 2026-06-08
**Status:** Approved

## Goal

Support three languages across the site: **PT-BR (default)**, **EN**, and **ES**. Add a Spanish translation, surface a Spain flag in the existing flag selector, and persist the chosen language across reloads via localStorage.

## Existing structure

- `src/i18n/en.ts` — schema source of truth (`export default {...}`); all other locales are typed `typeof en`.
- `src/i18n/pt-BR.ts` — `const ptBR: typeof en`.
- `src/i18n/index.ts` — maps `{ en, 'pt-BR': ptBR }`.
- `src/boot/i18n.ts` — `createI18n` with `locale: 'pt-BR'`, `fallbackLocale: 'en'`.
- `src/components/AppNav.vue` — flag selector (desktop `nav__lang` + drawer), `setLocale(l)` sets `locale.value`.
- `src/components/Illustrations.ts` — `FlagBR`, `FlagEN` inline-SVG `defineComponent`s with `class="flag"`.

Locale codes stay in current style: `pt-BR`, `en`, `es` (no regional code for new locale).

## Changes

### 1. `src/i18n/es.ts` (new)
- `const es: typeof en = {...}`, `export default es`.
- Full Spanish translation of every key, playful tone matching PT/EN.
- `attrs` object keys stay PT-named (`fome`, `brincalhao`, `dorminhoco`, `ranzinza`, `briguento`) — they are data keys referenced elsewhere; only values translate.
- Preserve `{name}` placeholders in `cat.photoTag`, `family.litterOf`.
- `lang` block: `{ pt: 'PT', en: 'EN', es: 'ES', ptFull: 'Português', enFull: 'English', esFull: 'Español' }`.

### 2. `src/i18n/index.ts`
- `import es from './es'`, add `es` to export map.

### 3. lang labels — schema consistency
- Add `es: 'ES'` + `esFull: 'Español'` to the `lang` block in **`en.ts`, `pt-BR.ts`, and `es.ts`** so `typeof en` stays consistent.

### 4. `src/components/Illustrations.ts`
- New `FlagES` `defineComponent`: Spain flag (red / yellow / red horizontal bands, yellow band double height), `viewBox="0 0 28 20"`, rounded corners, `class="flag"`. Same shadow/border styling as existing flags.

### 5. `src/components/AppNav.vue`
- Import `FlagES`.
- Desktop `nav__lang`: add third button → `setLocale('es')`, `<FlagES />`, `aria-label`/`title` = `t('lang.esFull')`, `aria-pressed` on active.
- Drawer `drawer__lang`: add matching third button with `<FlagES /><span>{{ t('lang.es') }}</span>`.
- No CSS change required (flex row absorbs third flag).

### 6. localStorage persistence
- Key: `catastrophe.locale`.
- `src/boot/i18n.ts`: before `createI18n`, read saved value (SSR-guarded via `typeof window !== 'undefined'`), validate it is one of `Object.keys(messages)`; use it as initial `locale`, else fall back to `'pt-BR'`. `fallbackLocale` stays `'en'`.
- `AppNav.vue` `setLocale(l)`: set `locale.value = l` and write `catastrophe.locale` (SSR-guarded).

## Out of scope
- No regional Spanish variants (es-419 / es-MX).
- No automatic browser-language detection on first visit (default stays PT-BR).

## Testing / verification
- `npx eslint` + `vue-tsc` clean on changed files.
- Manual: switch to ES updates all visible strings; reload keeps ES; clearing the key reverts to PT-BR.

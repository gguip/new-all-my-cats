# AllMyCats — Vue + Quasar Cat Showcase

**Date:** 2026-06-07
**Status:** Approved (design)

## Overview

Single-scroll showcase site for a household of 18 rescued cats. Each cat is a
portrait card with five animated personality bars (Fome, Brincalhão, Dorminhoco,
Ranzinza, Briguento). Warm, playful custom brand ("Catastrophe") — olive / cream
/ orange palette, chunky rounded UI. **Not** Material Design.

Design source: `/Users/guilhermepassarinho/Downloads/design_handoff_allmycats`
(hifi handoff — tokens, components, screenshots, working React prototype). Recreate
pixel-faithfully in Vue + Quasar; photography is the only placeholder.

## Decisions (locked)

- **Data:** placeholders for now. 18 sample cats + photo placeholders live in an
  editable data file the user swaps later.
- **Quasar role:** scaffolding + build + SCSS only. UI components written custom
  using design tokens. No QBtn/QCard Material styling.
- **i18n:** vue-i18n via Quasar boot file. Locales `pt-BR` (default) + `en`,
  language toggle in nav. Cat proper names + numeric stats stay in the data file
  (not translated); all display copy lives in i18n messages.
- **Scaffold:** Quasar CLI (Vite) SPA.
- Out of scope: dark mode, PWA, SSR, backend/CMS, real photos.

## Stack

Quasar CLI (Vite) SPA · Vue 3 `<script setup>` · vue-i18n · SCSS with tokens
lifted from `design_system/tokens/*.css` + `base.css`. Fonts: Fredoka, Quicksand,
Caveat, Space Mono (Google Fonts).

## Structure

```
src/
  boot/i18n.js              # createI18n, locale pt-BR, fallback en
  i18n/{pt-BR,en}/index.js  # all copy (headlines, subs, FAQ, blurbs, trait labels)
  css/
    quasar.variables.scss   # map brand -> Quasar vars
    tokens.scss             # --olive/--orange/... from tokens/*.css
    app.scss                # base.css adapted (utility classes, font @import)
  data/cats.js              # ATTRS[5], CATS[18] (placeholder), FAQS  <- numeric stats
  assets/brand/*.svg        # logo-mark, paw-print, paw-pad, cat-sit, cat-stretch,
                            #   heart, yarn, sparkle
  composables/
    useScrollReveal.js      # IntersectionObserver; honors prefers-reduced-motion
    useNavScroll.js         # scrolled > 40px boolean
  components/
    AppNav.vue  AppDrawer.vue  BaseButton.vue  Photo.vue
    Illustrations.vue       # paws / silhouettes / social / logo inline SVG
    HeroSection.vue  WelcomeSection.vue
    CatGallery.vue  CatCard.vue  AttributeBar.vue
    SupportSection.vue  FaqSection.vue  FaqItem.vue
    ContactFooter.vue
  pages/IndexPage.vue       # composes the 7 sections in order
  layouts/MainLayout.vue    # nav + drawer + <router-view> + footer
```

## Sections (in order, per handoff)

1. **Nav** — fixed top, 3-col grid (`1fr auto 1fr`): left links, centered logo,
   right links. Max width 1180px. Links: The Cats (#team), About (#welcome),
   Support (#donate), Say Hi (#contact). Language toggle PT/EN.
2. **Hero** — full-width olive panel (46px radius, min-h 560px). Headline
   "Cats. Chaos. Cuddles." (one word `--orange`), subhead, "Meet the Cats" cream
   pill CTA → #team. Corner toe-bean paws, paw trail, walking-cat silhouette.
3. **Welcome/About** — two-tone statement, mission paragraph, 3-col offset photo
   feature row (Sunbeam Naps / A Little Chaos / Endless Zoomies).
4. **Cats Gallery** (core) — "Meet the Whole Gang!" + responsive grid (3 / 2 / 1
   cols at desktop / ≤920 / ≤560, 26px gap). CatCard: cream card, tan border,
   24px radius, hover lift; square photo, name with colored dot (olive/orange
   alternating), five AttributeBars.
5. **Support** — olive card, 2-col (copy left, photo right; stacks mobile),
   "Share the Love…", "Support a Shelter" cream CTA, outline hearts.
6. **FAQ** — single column accordion, single-open (first open by default),
   morphing +/− orange icon, max-height expand.
7. **Contact + Footer** — "Come Say Hi" 3-col blurbs, social circles (FB/IG/TikTok)
   lift+orange on hover. Olive footer band: logo + tagline + copyright.

## Behaviors

- **Nav scroll state:** `scrollY > 40` toggles olive bg, padding shrink, shadow,
  link color flip. 0.3s ease. → `useNavScroll`.
- **Mobile drawer:** <920px, right olive panel, slide 0.35s
  `cubic-bezier(.6,.05,.2,1)`; closes on backdrop click or link tap.
- **Scroll reveal:** below-fold content starts `opacity:0; translateY(26px)`,
  animates in once on view enter (0.7s). In-view-at-load renders visible. 2.6s
  failsafe. Honors `prefers-reduced-motion`. → `useScrollReveal`.
- **AttributeBar:** width 0 → value, 1s `cubic-bezier(.2,.75,.25,1)`, triggered
  when card enters view, per-bar stagger ~90ms.
- **Buttons:** lift 3px hover; chunky "leg" shadow compresses on press.
- **Cards:** lift 4px + deeper shadow on hover.
- **Smooth scroll** for in-page anchors.

## Data shape

```js
// src/data/cats.js
export const ATTRS = [
  { key: 'fome',       color: 'var(--attr-fome)' },
  { key: 'brincalhao', color: 'var(--attr-brincalhao)' },
  { key: 'dorminhoco', color: 'var(--attr-dorminhoco)' },
  { key: 'ranzinza',   color: 'var(--attr-ranzinza)' },
  { key: 'briguento',  color: 'var(--attr-briguento)' },
]
// trait labels come from i18n by key
export const CATS = [
  { name: 'Mingau', photo: null, fome: 85, brincalhao: 40, dorminhoco: 92,
    ranzinza: 30, briguento: 15 },
  // ... 18 total (placeholder names/values)
]
export const FAQS = [ /* { qKey, aKey } -> resolved via i18n */ ]
```

## State

All local (refs / composables). No store, no fetch. Router single route `/`.

## Tokens

Lift `design_system/tokens/{colors,typography,spacing,fonts}.css` into
`src/css/tokens.scss` as CSS custom properties. Map relevant ones into
`quasar.variables.scss` ($primary etc.) so Quasar internals don't clash. Adapt
`base.css` utility/component classes into `app.scss`.

Key colors: `--olive #7E8A52`, `--orange #F2873F`, `--cream #FFF1D7`,
`--surface-card #FFFAF0`, `--ink #3C3A2C`, `--body #6C6A57`. Attribute hues:
fome #F2873F, brincalhao #7E8A52, dorminhoco #6F8FAE, ranzinza #8A857A,
briguento #D2664A. Radius: pill 999, hero 46, large card 34, cat card 24,
photo 22, input 14.

## Testing

Vitest + Vue Test Utils on logic only:
- `useScrollReveal` — reveals on intersect; respects reduced-motion.
- `useNavScroll` — flips at >40.
- FAQ single-open — opening one closes others.
- AttributeBar — value maps to width %.

Static markup not unit-tested.

## Assets

Copy 8 brand SVGs from `design_system/assets/` to `src/assets/brand/`. Decorative
SVGs recolor via `currentColor`; `paw-pad` takes explicit fur/pad fills. No icon
font / third-party icon set — social glyphs drawn inline.

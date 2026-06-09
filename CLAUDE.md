# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Production build to dist/spa/
npm test             # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint check
npm run format       # Prettier format all files
```

## Tech Stack

- **Vue 3** with Composition API only (no Options API)
- **Quasar 2** with Vite bundler
- **TypeScript** in strict mode
- **vue-i18n** for internationalization (pt-BR, en, es)
- **Vitest** + Vue Test Utils for testing
- Node ^22.12 or newer required

## Architecture

**Static SPA** — no backend, no global state management. All data lives in `/src/data/` as TypeScript files.

### Key Directories

- `src/components/` — UI components; `family/` subdirectory for timeline-specific components
- `src/composables/` — Reusable composition functions (`useScrollReveal`, `useNavScroll`)
- `src/css/` — SCSS + design tokens in `css/tokens/` (colors, typography, spacing)
- `src/data/` — Static data (`cats.ts` with 18 cat profiles, `family.ts` with timeline data)
- `src/i18n/` — Locale message files; locale persisted to localStorage key `catastrophe.locale`
- `src/pages/` — Route components (`IndexPage`, `FamilyTreePage`, `ErrorNotFound`)
- `src/layouts/` — `MainLayout` (standard nav/footer), `FullScreenLayout` (family timeline)

### Routing

Hash-based routing (`vueRouterMode: 'hash'`):
- `/` — Landing page (MainLayout)
- `/familia` — Family timeline (FullScreenLayout)

### Styling

- SCSS with CSS custom properties for theming
- Design tokens in `src/css/tokens/`: `colors.css`, `fonts.css`, `typography.css`, `spacing.css`
- Brand colors: olive greens, apricot orange, cream neutrals
- No Tailwind or external CSS framework

### Data Types

Cat profiles in `src/data/cats.ts` use personality attributes: `fome`, `brincalhao`, `dorminhoco`, `ranzinza`, `briguento` (0-100 scale).

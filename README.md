# 🐾 AllMyCats

> Seventeen cats. One house. Zero regrets.

A playful single-page site for **Catastrophe** — a home full of cats. Built with Vue 3 + Quasar, it features a landing page and a scrolling family timeline of how the whole crew arrived, all in three languages.

🔗 **Live:** _add deploy URL here_

---

## ✨ Features

- 🏠 **Landing page** — hero, welcome, support, FAQ and contact sections
- 🐱 **Cat gallery** — meet every cat with personality attribute bars
- 📜 **Family timeline** (`/familia`) — year-bucket timeline of when each cat joined, with a name-based detail panel
- 🌍 **i18n** — Portuguese 🇧🇷, English 🇬🇧 and Spanish 🇪🇸, with the choice persisted in `localStorage`
- 🐾 **Paw-print branding** — custom inline-SVG logo that adapts to light and olive headers
- ♿ **Accessible & responsive** — semantic markup, ARIA labels, scroll-reveal animations

## 🛠️ Tech Stack

| Area       | Tooling                                   |
| ---------- | ----------------------------------------- |
| Framework  | [Vue 3](https://vuejs.org) (Composition API) |
| App layer  | [Quasar 2](https://quasar.dev) (Vite)     |
| Routing    | Vue Router                                |
| i18n       | vue-i18n                                  |
| Language   | TypeScript                                |
| Testing    | Vitest + Vue Test Utils                   |
| Quality    | ESLint + Prettier                         |

## 🚀 Getting Started

Requires Node `^22.12` (or newer — see `.nvmrc`).

```bash
# install dependencies
npm install

# start dev server (hot reload)
npm run dev      # quasar dev

# run unit tests
npm test

# lint & format
npm run lint
npm run format

# production build
npm run build    # quasar build
```

## 📁 Project Structure

```
src/
├── boot/          # app bootstrap (i18n setup)
├── components/    # UI sections, cards, illustrations
│   └── family/    # timeline-specific components
├── composables/   # reusable logic (scroll reveal, nav scroll)
├── css/           # global styles + design tokens
├── data/          # cats & family data
├── i18n/          # pt-BR, en, es locale messages
├── lib/           # timeline helpers
├── pages/         # IndexPage, FamilyTreePage, 404
└── router/        # routes
test/unit/         # Vitest specs
```

## 🌐 Routes

| Path       | Page                                |
| ---------- | ----------------------------------- |
| `/`        | Landing page                        |
| `/familia` | Family timeline (full-screen layout) |

## 🧪 Tests

Unit tests cover components, composables and i18n integrity:

```bash
npm test            # run once
npm run test:watch  # watch mode
```

## 📦 Build & Deploy

`npm run build` outputs a static SPA to `dist/spa/`, deployable to any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting, …).

---

Made with patas 🐾 & amor ♥️ by [gguip](https://github.com/gguip)

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
    const w = mountPanel(family[1]!)
    expect(w.text()).toContain('Amora')
    expect(w.text()).toContain('Mingau')
  })

  it('lists children for a mother', () => {
    const w = mountPanel(family[0]!)
    expect(w.text()).toContain('Amora')
  })

  it('renders personality bars for a cat present in cats.ts', () => {
    const w = mountPanel(family[0]!)
    expect(w.findAll('.stat').length).toBeGreaterThan(0)
  })

  it('renders no personality bars for an unknown cat', () => {
    const w = mountPanel({ name: 'Fantasma', arrival: '2020', sex: 'x' })
    expect(w.findAll('.stat').length).toBe(0)
  })
})

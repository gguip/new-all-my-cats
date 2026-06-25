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

  it("renders the cat's standardized photo", () => {
    const img = mountCard().find('.tcard__photo img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/cats/mingau.webp')
  })
})

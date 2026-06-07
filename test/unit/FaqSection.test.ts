import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import FaqSection from 'src/components/FaqSection.vue'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })

function mountFaq() {
  return mount(FaqSection, { global: { plugins: [i18n] } })
}

describe('FaqSection', () => {
  it('renders all 6 items', () => {
    expect(mountFaq().findAll('.faq__item')).toHaveLength(6)
  })

  it('first item is open by default', () => {
    const items = mountFaq().findAll('.faq__item')
    expect(items[0].classes()).toContain('open')
    expect(items[1].classes()).not.toContain('open')
  })

  it('opening one closes the others (single-open)', async () => {
    const w = mountFaq()
    const items = w.findAll('.faq__item')
    await items[2].get('.faq__q').trigger('click')
    expect(w.findAll('.faq__item')[2].classes()).toContain('open')
    expect(w.findAll('.faq__item')[0].classes()).not.toContain('open')
  })

  it('clicking the open item closes it (none open)', async () => {
    const w = mountFaq()
    await w.findAll('.faq__item')[0].get('.faq__q').trigger('click')
    expect(w.findAll('.faq__item').every((i) => !i.classes().includes('open'))).toBe(true)
  })
})

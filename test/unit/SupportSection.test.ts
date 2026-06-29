import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import SupportSection from 'src/components/SupportSection.vue'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })

function mountSupport(locale = 'pt-BR') {
  i18n.global.locale.value = locale as 'pt-BR' | 'en' | 'es'
  return mount(SupportSection, { global: { plugins: [i18n] } })
}

describe('SupportSection donate button', () => {
  it('links to a Google Maps search with the pt-BR query', () => {
    const btn = mountSupport('pt-BR').get('.btn')
    expect(btn.attributes('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent('abrigo de gatos para adoção'),
    )
  })

  it('opens in a new tab with safe rel', () => {
    const btn = mountSupport('pt-BR').get('.btn')
    expect(btn.attributes('target')).toBe('_blank')
    expect(btn.attributes('rel')).toContain('noopener')
    expect(btn.attributes('rel')).toContain('noreferrer')
  })

  it('uses the active locale query term', () => {
    const btn = mountSupport('en').get('.btn')
    expect(btn.attributes('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent('cat shelter adoption'),
    )
  })
})

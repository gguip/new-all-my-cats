import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })
const { t, locale } = i18n.global

describe('i18n messages', () => {
  it('has both locales', () => {
    expect(Object.keys(messages).sort()).toEqual(['en', 'pt-BR'])
  })
  it('defaults to pt-BR copy', () => {
    locale.value = 'pt-BR'
    expect(t('hero.title')).toBe('Gatos. Caos. Carinho.')
    expect(t('attrs.fome')).toBe('Fome')
  })
  it('translates to en', () => {
    locale.value = 'en'
    expect(t('hero.title')).toBe('Cats. Chaos. Cuddles.')
    expect(t('attrs.fome')).toBe('Hungry')
  })
  it('builds cat photo tag with name param', () => {
    locale.value = 'pt-BR'
    expect(t('cat.photoTag', { name: 'Mingau' })).toBe('foto de Mingau')
    locale.value = 'en'
    expect(t('cat.photoTag', { name: 'Mingau' })).toBe('photo of Mingau')
  })
  it('builds the litterOf label with a name param', () => {
    locale.value = 'pt-BR'
    expect(t('family.litterOf', { name: 'Mingau' })).toBe('filhos de Mingau')
    locale.value = 'en'
    expect(t('family.litterOf', { name: 'Mingau' })).toBe('kittens of Mingau')
  })
  it('exposes all 6 faq items in both locales', () => {
    expect(messages.en.faq.items).toHaveLength(6)
    expect(messages['pt-BR'].faq.items).toHaveLength(6)
  })
})

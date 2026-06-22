import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import CatCard from 'src/components/CatCard.vue'
import { ATTRS } from 'src/data/cats'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })
const cat = { name: 'Mingau', fome: 85, brincalhao: 40, dorminhoco: 92, ranzinza: 30, briguento: 15 }
const nina = { name: 'Nina', fome: 70, brincalhao: 50, dorminhoco: 80, ranzinza: 40, briguento: 20 }

function mountCard() {
  return mount(CatCard, { props: { cat, attrs: ATTRS }, global: { plugins: [i18n] } })
}

function mountNina() {
  return mount(CatCard, { props: { cat: nina, attrs: ATTRS }, global: { plugins: [i18n] } })
}

describe('CatCard', () => {
  it('shows the cat name', () => {
    expect(mountCard().get('h4').text()).toBe('Mingau')
  })

  it('renders one bar per attribute (5)', () => {
    expect(mountCard().findAll('.stat')).toHaveLength(5)
  })

  it('renders the cat photo with a name-based src and i18n alt', () => {
    const img = mountCard().get('.photo img')
    expect(img.attributes('src')).toBe('/cats/mingau.webp')
    expect(img.attributes('alt')).toBe('foto de Mingau')
  })

  it('bars become live when the card intersects', async () => {
    const w = mountCard()
    expect(w.get('.stat__fill').attributes('style')).toContain('width: 0%')
    ;(globalThis as unknown as { __IO__: { instances: { trigger: (v?: boolean) => void }[] } }).__IO__.instances.at(-1)!.trigger(true)
    await w.vm.$nextTick()
    expect(w.get('.stat__fill').attributes('style')).toContain('width: 85%')
  })

  it('shows anos-de-casa for a cat in FAMILY', () => {
    const expected = new Date().getFullYear() - 2012
    expect(mountNina().get('.cat-card__age').text()).toBe(`${expected} anos de casa`)
  })

  it('omits the age label for a cat not in FAMILY', () => {
    expect(mountCard().find('.cat-card__age').exists()).toBe(false)
  })
})

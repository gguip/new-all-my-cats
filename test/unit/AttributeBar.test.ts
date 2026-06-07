import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AttributeBar from 'src/components/AttributeBar.vue'

describe('AttributeBar', () => {
  it('renders label and value%', () => {
    const w = mount(AttributeBar, { props: { label: 'Fome', value: 85, color: 'red', live: true } })
    expect(w.get('.stat__label').text()).toBe('Fome')
    expect(w.get('.stat__val').text()).toBe('85%')
  })

  it('fill width is 0 until live, then value%', async () => {
    const w = mount(AttributeBar, { props: { label: 'Fome', value: 85, color: 'red', live: false } })
    expect(w.get('.stat__fill').attributes('style')).toContain('width: 0%')
    await w.setProps({ live: true })
    expect(w.get('.stat__fill').attributes('style')).toContain('width: 85%')
  })

  it('applies the trait color to the fill background', () => {
    const w = mount(AttributeBar, { props: { label: 'Fome', value: 50, color: 'var(--attr-fome)', live: true } })
    expect(w.get('.stat__fill').attributes('style')).toContain('var(--attr-fome)')
  })
})

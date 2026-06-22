import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPhoto from 'src/components/AppPhoto.vue'

describe('AppPhoto', () => {
  it('renders an <img> with src and alt when src is given', () => {
    const w = mount(AppPhoto, { props: { src: '/cats/nina.webp', label: 'foto de Nina' } })
    const img = w.get('img')
    expect(img.attributes('src')).toBe('/cats/nina.webp')
    expect(img.attributes('alt')).toBe('foto de Nina')
    expect(w.find('.photo__tag').exists()).toBe(false)
  })

  it('falls back to the text placeholder when src is absent', () => {
    const w = mount(AppPhoto, { props: { label: 'foto de Nina' } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.get('.photo__tag').text()).toBe('foto de Nina')
  })

  it('falls back to the placeholder when the image errors (404)', async () => {
    const w = mount(AppPhoto, { props: { src: '/cats/missing.webp', label: 'foto de X' } })
    await w.get('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
    expect(w.get('.photo__tag').text()).toBe('foto de X')
  })

  it('applies the cls class to the photo container', () => {
    const w = mount(AppPhoto, { props: { cls: 'photo--memorial' } })
    expect(w.get('.photo').classes()).toContain('photo--memorial')
  })
})

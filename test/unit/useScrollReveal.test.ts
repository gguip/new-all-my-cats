import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollReveal from 'src/components/ScrollReveal.vue'

describe('ScrollReveal', () => {
  it('reveals (adds in) when the observer reports intersection', async () => {
    const wrapper = mount(ScrollReveal, { slots: { default: '<p>hi</p>' } })
    const root = wrapper.get('.reveal')
    const io = (
      globalThis as unknown as { __IO__: { instances: { trigger: (v?: boolean) => void }[] } }
    ).__IO__.instances.at(-1)!
    io.trigger(true)
    await wrapper.vm.$nextTick()
    expect(root.classes()).toContain('in')
  })

  it('reveals via failsafe timer even without intersection', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ScrollReveal, { slots: { default: '<p>hi</p>' } })
    vi.advanceTimersByTime(2600)
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.reveal').classes()).toContain('in')
    vi.useRealTimers()
  })
})

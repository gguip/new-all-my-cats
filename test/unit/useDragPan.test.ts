import { describe, it, expect } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useDragPan } from 'src/composables/useDragPan'

const Host = defineComponent({
  setup() {
    const stage = ref<HTMLElement | null>(null)
    useDragPan(stage)
    return () =>
      h('div', { class: 'stage', ref: stage }, [
        h('div', { class: 'canvas' }, [h('div', { class: 'node' }, 'n')]),
      ])
  },
})

function evt(type: string, x: number, y: number, target: Element) {
  const e = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true })
  target.dispatchEvent(e)
  return e
}

describe('useDragPan', () => {
  it('pans the stage scroll on background drag', () => {
    const w = mount(Host, { attachTo: document.body })
    const stage = w.get('.stage').element as HTMLElement
    const canvas = w.get('.canvas').element
    evt('pointerdown', 100, 100, canvas)
    evt('pointermove', 90, 80, canvas)
    expect(stage.scrollLeft).toBe(10) // 0 - (90 - 100)
    expect(stage.scrollTop).toBe(20) // 0 - (80 - 100)
    evt('pointerup', 90, 80, canvas)
    w.unmount()
  })

  it('does not pan when the drag starts on a node', () => {
    const w = mount(Host, { attachTo: document.body })
    const stage = w.get('.stage').element as HTMLElement
    const node = w.get('.node').element
    evt('pointerdown', 100, 100, node)
    evt('pointermove', 60, 60, node)
    expect(stage.scrollLeft).toBe(0)
    expect(stage.scrollTop).toBe(0)
    evt('pointerup', 60, 60, node)
    w.unmount()
  })
})

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useAutoplayVideo } from 'src/composables/useAutoplayVideo'

// Grab the IntersectionObserver mock installed by test/setup.ts.
const IO = (globalThis as unknown as { __IO__: { instances: { trigger(v: boolean): void }[] } })
  .__IO__

// Configurable matchMedia: true for whichever queries we list in `matches`.
function setMatchMedia(matchingQueries: string[]) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matchingQueries.includes(query),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }))
}

// jsdom does not implement media playback — stub it and spy.
let play: ReturnType<typeof vi.fn>
let pause: ReturnType<typeof vi.fn>

beforeEach(() => {
  IO.instances.length = 0
  play = vi.fn().mockResolvedValue(undefined)
  pause = vi.fn()
  HTMLMediaElement.prototype.play = play
  HTMLMediaElement.prototype.pause = pause
})

afterEach(() => {
  vi.restoreAllMocks()
})

// Minimal host that wires the composable to a real <video> element.
const Host = defineComponent({
  setup() {
    const v = ref<HTMLVideoElement | null>(null)
    useAutoplayVideo(v)
    return () => h('video', { ref: v })
  },
})

describe('useAutoplayVideo (hover-capable device)', () => {
  it('plays on mouseenter and pauses on mouseleave', () => {
    setMatchMedia(['(hover: hover)'])
    const wrapper = mount(Host)
    const el = wrapper.get('video').element

    el.dispatchEvent(new Event('mouseenter'))
    expect(play).toHaveBeenCalledTimes(1)

    el.dispatchEvent(new Event('mouseleave'))
    expect(pause).toHaveBeenCalledTimes(1)
  })

  it('does not create an IntersectionObserver', () => {
    setMatchMedia(['(hover: hover)'])
    mount(Host)
    expect(IO.instances.length).toBe(0)
  })
})

describe('useAutoplayVideo (touch device)', () => {
  it('plays when intersecting and pauses when leaving', () => {
    setMatchMedia([]) // no hover, no reduced motion
    mount(Host)
    expect(IO.instances.length).toBe(1)

    IO.instances[0]!.trigger(true)
    expect(play).toHaveBeenCalledTimes(1)

    IO.instances[0]!.trigger(false)
    expect(pause).toHaveBeenCalledTimes(1)
  })
})

describe('useAutoplayVideo (reduced motion)', () => {
  it('binds nothing and never plays', () => {
    setMatchMedia(['(prefers-reduced-motion: reduce)', '(hover: hover)'])
    const wrapper = mount(Host)
    const el = wrapper.get('video').element

    el.dispatchEvent(new Event('mouseenter'))
    expect(IO.instances.length).toBe(0)
    expect(play).not.toHaveBeenCalled()
  })
})

describe('useAutoplayVideo cleanup', () => {
  it('removes hover listeners on unmount', () => {
    setMatchMedia(['(hover: hover)'])
    const wrapper = mount(Host)
    const el = wrapper.get('video').element
    wrapper.unmount()

    el.dispatchEvent(new Event('mouseenter'))
    expect(play).not.toHaveBeenCalled()
  })
})

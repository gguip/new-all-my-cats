import { describe, it, expect, beforeEach } from 'vitest'
import { useNavScroll } from 'src/composables/useNavScroll'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('useNavScroll', () => {
  beforeEach(() => setScrollY(0))

  it('starts false at top', () => {
    const { scrolled, start, stop } = useNavScroll()
    start()
    expect(scrolled.value).toBe(false)
    stop()
  })

  it('flips true past 40px', () => {
    const { scrolled, start, stop } = useNavScroll()
    start()
    setScrollY(41)
    expect(scrolled.value).toBe(true)
    stop()
  })

  it('flips back false at/under 40px', () => {
    const { scrolled, start, stop } = useNavScroll()
    start()
    setScrollY(100)
    setScrollY(40)
    expect(scrolled.value).toBe(false)
    stop()
  })
})

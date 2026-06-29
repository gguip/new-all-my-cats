import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import WelcomeSection from 'src/components/WelcomeSection.vue'

const i18n = createI18n({ legacy: false, locale: 'pt-BR', fallbackLocale: 'en', messages })

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(hover: hover)',
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })) as unknown as typeof window.matchMedia
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined) as never
  HTMLMediaElement.prototype.pause = vi.fn() as never
})

function mountWelcome() {
  return mount(WelcomeSection, { global: { plugins: [i18n] } })
}

describe('WelcomeSection feature cards', () => {
  it('renders a single video for the Sonecas card', () => {
    const wrapper = mountWelcome()
    const videos = wrapper.findAll('video')
    expect(videos).toHaveLength(1)
    const sources = videos[0]!.findAll('source')
    expect(sources[0]!.attributes('src')).toBe('/cats/sonecas.webm')
    expect(sources[1]!.attributes('src')).toBe('/cats/sonecas.mp4')
  })

  it('keeps placeholder tags for the other two cards', () => {
    const wrapper = mountWelcome()
    // 3 feature cards total: 1 video + 2 placeholder tags.
    expect(wrapper.findAll('.feature')).toHaveLength(3)
    expect(wrapper.findAll('.photo__tag')).toHaveLength(2)
  })
})

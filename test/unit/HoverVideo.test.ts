import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HoverVideo from 'src/components/HoverVideo.vue'

beforeEach(() => {
  // Default: hover-capable, motion allowed (so onMounted has a defined matchMedia).
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

function mountVideo() {
  return mount(HoverVideo, {
    props: {
      webm: '/cats/sonecas.webm',
      mp4: '/cats/sonecas.mp4',
      cls: 'photo--sq',
      label: 'gato tirando soneca no sol',
    },
  })
}

describe('HoverVideo', () => {
  it('renders sources WebM first, then MP4, with a first-frame fragment', () => {
    const sources = mountVideo().findAll('source')
    expect(sources).toHaveLength(2)
    expect(sources[0]!.attributes('type')).toBe('video/webm')
    expect(sources[0]!.attributes('src')).toBe('/cats/sonecas.webm#t=0.001')
    expect(sources[1]!.attributes('type')).toBe('video/mp4')
    expect(sources[1]!.attributes('src')).toBe('/cats/sonecas.mp4#t=0.001')
  })

  it('applies the cls to the photo frame and is a looping inline video', () => {
    const wrapper = mountVideo()
    expect(wrapper.get('.photo').classes()).toContain('photo--sq')
    const video = wrapper.get('video')
    expect(video.attributes('loop')).toBeDefined()
    expect(video.attributes('playsinline')).toBeDefined()
    expect(video.attributes('aria-label')).toBe('gato tirando soneca no sol')
  })

  it('mutes the video element on mount', () => {
    const el = mountVideo().get('video').element as HTMLVideoElement
    expect(el.muted).toBe(true)
  })
})

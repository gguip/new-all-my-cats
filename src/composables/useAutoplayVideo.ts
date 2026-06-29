import { onMounted, onBeforeUnmount, type Ref } from 'vue'

/**
 * Autoplays a muted video based on device capability:
 * hover-capable devices play on hover; touch devices play when the element is
 * ~half visible. Respects prefers-reduced-motion (then it does nothing).
 * Pauses in place (does not reset currentTime).
 */
export function useAutoplayVideo(videoRef: Ref<HTMLVideoElement | null>): void {
  let observer: IntersectionObserver | null = null
  let removeListeners: (() => void) | null = null

  const safePlay = (): void => {
    const el = videoRef.value
    if (!el) return
    el.play().catch(() => {})
  }
  const pause = (): void => {
    videoRef.value?.pause()
  }

  onMounted(() => {
    const el = videoRef.value
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (window.matchMedia('(hover: hover)').matches) {
      el.addEventListener('mouseenter', safePlay)
      el.addEventListener('mouseleave', pause)
      removeListeners = () => {
        el.removeEventListener('mouseenter', safePlay)
        el.removeEventListener('mouseleave', pause)
      }
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) safePlay()
            else pause()
          }
        },
        { threshold: 0.5 },
      )
      observer.observe(el)
    }
  })

  onBeforeUnmount(() => {
    removeListeners?.()
    observer?.disconnect()
  })
}

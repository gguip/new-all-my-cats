import { onMounted, onBeforeUnmount, type Ref } from 'vue'

// Arms an element for a one-time entrance reveal once it enters the viewport.
export function useScrollReveal(
  elRef: Ref<HTMLElement | null>,
  { failsafeMs = 2600, rootMargin = '0px 0px -8% 0px' } = {},
) {
  let observer: IntersectionObserver | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  const reveal = (el: HTMLElement) => {
    el.classList.add('in')
    cleanup()
  }
  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.classList.add('armed')
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal(el)
      },
      { rootMargin },
    )
    observer.observe(el)
    timer = setTimeout(() => reveal(el), failsafeMs) // failsafe: never stay hidden
  })

  onBeforeUnmount(cleanup)
}

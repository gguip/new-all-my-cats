import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'

export function useNavScroll(threshold = 40) {
  const scrolled = ref(false)
  const onScroll = () => {
    scrolled.value = window.scrollY > threshold
  }

  const start = () => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }
  const stop = () => window.removeEventListener('scroll', onScroll)

  // Auto-wire when used inside a component setup(); no-op in plain tests.
  if (getCurrentInstance()) {
    onMounted(start)
    onUnmounted(stop)
  }

  return { scrolled, start, stop }
}

import { onMounted, onBeforeUnmount, type Ref } from 'vue'

// Drag the empty canvas background to pan the stage's scroll position.
export function useDragPan(stageRef: Ref<HTMLElement | null>) {
  let down = false
  let sx = 0
  let sy = 0
  let l0 = 0
  let t0 = 0

  const onDown = (ev: PointerEvent) => {
    const target = ev.target as HTMLElement | null
    if (target && target.closest('.node')) return // let nodes handle their own clicks
    const stage = stageRef.value
    if (!stage) return
    down = true
    sx = ev.clientX
    sy = ev.clientY
    l0 = stage.scrollLeft
    t0 = stage.scrollTop
    stage.firstElementChild?.classList.add('grabbing')
  }
  const onMove = (ev: PointerEvent) => {
    if (!down) return
    const stage = stageRef.value
    if (!stage) return
    stage.scrollLeft = l0 - (ev.clientX - sx)
    stage.scrollTop = t0 - (ev.clientY - sy)
  }
  const onUp = () => {
    down = false
    stageRef.value?.firstElementChild?.classList.remove('grabbing')
  }

  onMounted(() => {
    const stage = stageRef.value
    if (!stage) return
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  })
  onBeforeUnmount(() => {
    stageRef.value?.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  })
}

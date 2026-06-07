<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value?: number
    color?: string
    live?: boolean
    delay?: number
  }>(),
  { value: 0, color: 'var(--orange)', live: false, delay: 0 },
)

const fillStyle = computed(() => ({
  width: (props.live ? props.value : 0) + '%',
  background: props.color,
  transitionDelay: props.delay + 'ms',
}))
</script>

<template>
  <div class="stat">
    <div class="stat__top">
      <span class="stat__label">{{ label }}</span>
      <span class="stat__val">{{ value }}%</span>
    </div>
    <div class="stat__track">
      <div class="stat__fill" :style="fillStyle" />
    </div>
  </div>
</template>

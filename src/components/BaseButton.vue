<script setup lang="ts">
const props = defineProps<{
  href?: string
  variant?: '' | 'orange' | 'ghost'
}>()

function handleClick(e: MouseEvent) {
  if (props.href?.startsWith('#') && props.href.length > 1) {
    const el = document.getElementById(props.href.slice(1))
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <a
    :href="props.href ?? '#'"
    class="btn"
    :class="props.variant ? `btn--${props.variant}` : ''"
    @click="handleClick"
  >
    <slot />
  </a>
</template>

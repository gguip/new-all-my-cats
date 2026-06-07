<script setup lang="ts">
const props = defineProps<{
  href?: string
  variant?: '' | 'orange' | 'ghost'
}>()
</script>

<template>
  <a :href="props.href ?? '#'" class="btn" :class="props.variant ? `btn--${props.variant}` : ''">
    <slot />
  </a>
</template>

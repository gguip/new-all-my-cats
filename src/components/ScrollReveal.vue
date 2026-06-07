<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from 'src/composables/useScrollReveal'

const el = ref<HTMLElement | null>(null)
useScrollReveal(el)
</script>

<template>
  <div ref="el" class="reveal">
    <slot />
  </div>
</template>

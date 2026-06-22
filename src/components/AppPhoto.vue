<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  label?: string
  cls?: string
  src?: string
}>()

const failed = ref(false)
// Reset the fallback if the source changes (e.g. reused component instance).
watch(
  () => props.src,
  () => {
    failed.value = false
  },
)
</script>

<template>
  <div class="photo" :class="cls">
    <img v-if="src && !failed" :src="src" :alt="label" @error="failed = true" />
    <span v-else class="photo__tag">{{ label }}</span>
  </div>
</template>

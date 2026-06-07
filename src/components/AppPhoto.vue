<script setup lang="ts">
defineProps<{
  label?: string
  cls?: string
}>()
</script>

<template>
  <div class="photo" :class="cls">
    <span class="photo__tag">{{ label }}</span>
  </div>
</template>

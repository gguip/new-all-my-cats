<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineEmits<{ 'zoom-in': []; 'zoom-out': [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="zoom">
    <button :aria-label="t('family.zoomIn')" @click="$emit('zoom-in')">+</button>
    <button :aria-label="t('family.zoomOut')" @click="$emit('zoom-out')">−</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  question: string
  answer: string
  open?: boolean
}>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="faq__item" :class="{ open: props.open }">
    <button class="faq__q" @click="$emit('toggle')">
      <span>{{ props.question }}</span>
      <span class="faq__icon" />
    </button>
    <div class="faq__a" :style="{ maxHeight: props.open ? '240px' : '0' }">
      <div class="faq__a-inner">{{ props.answer }}</div>
    </div>
  </div>
</template>

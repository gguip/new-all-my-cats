<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'

const props = defineProps<{
  cat: FamilyCat
  selected?: boolean
}>()
defineEmits<{ select: [name: string] }>()

const { t } = useI18n()
// The typed `t` rejects template-literal keys; loosen it for the photo tag.
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const sexCls = (s: FamilyCat['sex']) => (s === 'f' ? 'sex-f' : s === 'm' ? 'sex-m' : 'sex-x')
</script>

<template>
  <div
    class="tcard"
    :class="{ sel: props.selected }"
    role="button"
    tabindex="0"
    :aria-pressed="props.selected ? 'true' : 'false'"
    @click.stop="$emit('select', props.cat.name)"
    @keydown.enter.space.prevent.stop="$emit('select', props.cat.name)"
  >
    <div class="tcard__photo"><span>{{ td('cat.photoTag', { name: props.cat.name }) }}</span></div>
    <div class="tcard__name">
      <span class="sexdot" :class="sexCls(props.cat.sex)" />{{ props.cat.name || '—' }}
    </div>
    <div v-if="props.cat.birth" class="tcard__birth">{{ props.cat.birth }}</div>
  </div>
</template>

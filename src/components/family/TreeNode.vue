<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'

const props = defineProps<{
  cat: FamilyCat
  x: number
  y: number
  selected?: boolean
}>()
defineEmits<{ select: [id: number] }>()

const { t } = useI18n()
// loosened signature for the parameterized photo-tag key
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const sexCls = (s: FamilyCat['sex']) => (s === 'f' ? 'sex-f' : s === 'm' ? 'sex-m' : 'sex-x')
</script>

<template>
  <div
    class="node"
    :class="{ sel: props.selected }"
    :style="{ left: props.x + 'px', top: props.y + 'px' }"
    @click.stop="$emit('select', props.cat.id)"
  >
    <div class="node__photo"><span>{{ td('cat.photoTag', { name: props.cat.name }) }}</span></div>
    <div class="node__name">
      <span class="sexdot" :class="sexCls(props.cat.sex)" />{{ props.cat.name || '—' }}
    </div>
    <div v-if="props.cat.birth" class="node__birth">{{ props.cat.birth }}</div>
  </div>
</template>

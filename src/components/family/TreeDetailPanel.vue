<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'

const props = defineProps<{
  cat: FamilyCat | null
  byId: Record<number, FamilyCat>
}>()
defineEmits<{ close: [] }>()

const { t } = useI18n()
const nameOf = (id: number | null): string =>
  id != null ? (props.byId[id]?.name ?? t('family.none')) : t('family.none')
const sexLabel = (s: FamilyCat['sex']): string =>
  s === 'f' ? t('family.sexF') : s === 'm' ? t('family.sexM') : t('family.sexX')
</script>

<template>
  <div class="panel" :class="{ open: props.cat }">
    <template v-if="props.cat">
      <div class="panel__head">
        <h3>{{ t('family.detail') }}</h3>
        <button class="panel__close" :aria-label="t('a11y.close')" @click="$emit('close')">×</button>
      </div>
      <div class="panel__body">
        <div class="field"><label>{{ t('family.fName') }}</label><p class="panel__val">{{ props.cat.name }}</p></div>
        <div class="field"><label>{{ t('family.fBirth') }}</label><p class="panel__val">{{ props.cat.birth || t('family.none') }}</p></div>
        <div class="field"><label>{{ t('family.fSex') }}</label><p class="panel__val">{{ sexLabel(props.cat.sex) }}</p></div>
        <div class="panel__divider" />
        <div class="field"><label>{{ t('family.fMom') }}</label><p class="panel__val">{{ nameOf(props.cat.momId) }}</p></div>
        <div class="field"><label>{{ t('family.fDad') }}</label><p class="panel__val">{{ nameOf(props.cat.dadId) }}</p></div>
        <div class="field"><label>{{ t('family.fPartner') }}</label><p class="panel__val">{{ nameOf(props.cat.partnerId) }}</p></div>
      </div>
    </template>
  </div>
</template>

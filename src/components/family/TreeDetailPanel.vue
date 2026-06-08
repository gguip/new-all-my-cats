<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FamilyCat } from 'src/data/family'
import { CATS, ATTRS, type Cat } from 'src/data/cats'
import AttributeBar from 'src/components/AttributeBar.vue'

const props = defineProps<{
  cat: FamilyCat | null
  family: FamilyCat[]
}>()
defineEmits<{ close: [] }>()

const { t } = useI18n()
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const sexLabel = (s: FamilyCat['sex']): string =>
  s === 'f' ? t('family.sexF') : s === 'm' ? t('family.sexM') : t('family.sexX')

const children = computed<FamilyCat[]>(() =>
  props.cat ? props.family.filter((c) => c.momName === props.cat!.name) : [],
)

const stats = computed<Cat | null>(() =>
  props.cat ? (CATS.find((c) => c.name === props.cat!.name) ?? null) : null,
)
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
        <div class="field"><label>{{ t('family.fArrival') }}</label><p class="panel__val">{{ props.cat.arrival || t('family.none') }}</p></div>
        <div class="field"><label>{{ t('family.fBirth') }}</label><p class="panel__val">{{ props.cat.birth || t('family.none') }}</p></div>
        <div class="field"><label>{{ t('family.fSex') }}</label><p class="panel__val">{{ sexLabel(props.cat.sex) }}</p></div>
        <div class="field"><label>{{ t('family.fMom') }}</label><p class="panel__val">{{ props.cat.momName || t('family.none') }}</p></div>
        <div v-if="children.length" class="field">
          <label>{{ t('family.fChildren') }}</label>
          <p class="panel__val">{{ children.map((c) => c.name).join(', ') }}</p>
        </div>

        <template v-if="stats">
          <div class="panel__divider" />
          <label class="panel__section">{{ t('family.personality') }}</label>
          <AttributeBar
            v-for="(a, i) in ATTRS"
            :key="a.key"
            :label="td(`attrs.${a.key}`)"
            :value="stats[a.key]"
            :color="a.color"
            :live="true"
            :delay="i * 60"
          />
        </template>
      </div>
    </template>
  </div>
</template>

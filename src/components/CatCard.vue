<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import AttributeBar from './AttributeBar.vue'
import AppPhoto from './AppPhoto.vue'
import type { Cat, Attr } from 'src/data/cats'

const props = defineProps<{
  cat: Cat
  attrs: Attr[]
}>()

const { t } = useI18n()
// The typed `t` rejects dynamic/template-literal keys; loosen the signature for
// the per-attribute label lookup and the parameterized photo tag.
const td = t as unknown as (key: string, named?: Record<string, unknown>) => string

const root = ref<HTMLElement | null>(null)
const live = ref(false)

let observer: IntersectionObserver | null = null
let timer: ReturnType<typeof setTimeout> | null = null
const cleanup = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  const el = root.value
  if (!el) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        live.value = true
        cleanup()
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  observer.observe(el)
  timer = setTimeout(() => {
    live.value = true
  }, 2600) // failsafe
})
onBeforeUnmount(cleanup)
</script>

<template>
  <div ref="root" class="cat-card" :class="{ 'cat-card--memorial': props.cat.memorial }">
    <AppPhoto :label="td('cat.photoTag', { name: props.cat.name })" :cls="props.cat.memorial ? 'photo--memorial' : ''" />
    <h4>
      {{ props.cat.name }}
      <span v-if="props.cat.memorial" class="cat-card__star" :title="td('cat.memorial')">★</span>
    </h4>
    <div class="cat-stats">
      <AttributeBar
        v-for="(a, i) in props.attrs"
        :key="a.key"
        :label="td(`attrs.${a.key}`)"
        :value="props.cat[a.key]"
        :color="a.color"
        :live="live"
        :delay="i * 90"
      />
    </div>
  </div>
</template>

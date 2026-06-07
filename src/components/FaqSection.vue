<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ScrollReveal from './ScrollReveal.vue'
import FaqItem from './FaqItem.vue'
import { CatStretch } from './Illustrations.vue'

const i18n = useI18n({ useScope: 'global' })
const t = (key: string) => i18n.t(key)
// computed so the list re-resolves on locale change; tm needs the global scope.
const items = computed(() => i18n.tm('faq.items'))
const open = ref(0) // index of the open item; -1 = none. First open by default.
const toggle = (i: number) => {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <section class="section" id="faq">
    <div class="wrap">
      <CatStretch
        :size="180"
        class="decor"
        :style="{ left: '50%', top: '-92px', transform: 'translateX(-50%)', color: 'var(--ink)', opacity: 0.85 }"
      />
      <ScrollReveal>
        <h2 class="section-head">
          <span class="o">{{ t('faq.headHl1') }}</span>{{ t('faq.headMid') }}<span class="o">{{ t('faq.headHl2') }}</span>
        </h2>
      </ScrollReveal>
      <ScrollReveal>
        <div class="faq">
          <FaqItem
            v-for="(f, i) in items"
            :key="i"
            :question="f.q"
            :answer="f.a"
            :open="open === i"
            @toggle="toggle(i)"
          />
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

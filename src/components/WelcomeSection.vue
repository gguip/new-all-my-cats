<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ScrollReveal from './ScrollReveal.vue'
import AppPhoto from './AppPhoto.vue'
import { PawPrint } from './Illustrations'

const i18n = useI18n({ useScope: 'global' })
const features = computed(() => i18n.tm('welcome.features'))

const scatter = [
  { x: '4%', y: '8%', r: -20, s: 34, c: 'var(--sage)', o: 0.5 },
  { x: '92%', y: '4%', r: 18, s: 26, c: 'var(--sage)', o: 0.5 },
  { x: '8%', y: '64%', r: 10, s: 30, c: 'var(--tan-2)', o: 0.5 },
  { x: '88%', y: '70%', r: -14, s: 30, c: 'var(--tan-2)', o: 0.5 },
]
const featureCls = ['photo--sq', 'photo--wide', 'photo--wide']
</script>

<template>
  <section class="section welcome" id="welcome">
    <div class="wrap">
      <PawPrint
        v-for="(p, i) in scatter"
        :key="i"
        :size="p.s"
        class="decor"
        :style="{ left: p.x, top: p.y, transform: `rotate(${p.r}deg)`, color: p.c, opacity: p.o }"
      />

      <ScrollReveal>
        <h2 class="welcome__statement">
          <span class="o">{{ i18n.t('welcome.statementPre') }}</span>{{ i18n.t('welcome.statementMid') }}<span class="o">{{ i18n.t('welcome.statementEnd') }}</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <div class="mission">
          <span class="doodle" :style="{ position: 'absolute', right: '14%', top: '-30px' }">{{ i18n.t('welcome.doodle') }}</span>
          <h3>{{ i18n.t('welcome.missionTitle') }}</h3>
          <p>{{ i18n.t('welcome.missionBody') }}</p>
        </div>
      </ScrollReveal>

      <div class="features">
        <ScrollReveal v-for="(f, i) in features" :key="i">
          <div class="feature">
            <div class="feature__label">{{ f.label }}</div>
            <AppPhoto :cls="featureCls[i] ?? ''" :label="f.tag" />
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>

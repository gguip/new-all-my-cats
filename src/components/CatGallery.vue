<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ScrollReveal from './ScrollReveal.vue'
import CatCard from './CatCard.vue'
import { PawPrint } from './Illustrations.vue'
import { CATS, ATTRS } from 'src/data/cats'

const { t } = useI18n()
</script>

<template>
  <section class="section" id="team">
    <div class="wrap">
      <ScrollReveal>
        <h2 class="section-head">
          {{ t('team.headStart') }}<span class="o">{{ t('team.headHighlight') }}</span>{{ t('team.headEnd') }}
        </h2>
      </ScrollReveal>
      <ScrollReveal>
        <p class="team__sub">{{ t('team.sub') }}</p>
      </ScrollReveal>
      <PawPrint
        :size="26"
        class="decor"
        :style="{ right: '6%', top: '70px', color: 'var(--tan-2)', opacity: 0.8, transform: 'rotate(20deg)' }"
      />
      <div class="team__grid">
        <CatCard v-for="c in CATS" :key="c.name" :cat="c" :attrs="ATTRS" />
      </div>
    </div>
  </section>
</template>

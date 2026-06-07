<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ScrollReveal from './ScrollReveal.vue'
import BaseButton from './BaseButton.vue'
import AppPhoto from './AppPhoto.vue'
import { Heart } from './Illustrations'

const { t } = useI18n()
const hearts = [0, 1, 2, 3, 4]
const heartStyle = (i: number) => ({
  display: 'inline-block',
  margin: '2px 4px',
  transform: `rotate(${i * 12 - 20}deg)`,
  color: i % 2 ? 'var(--orange)' : 'var(--cream-text)',
})
</script>

<template>
  <section class="section" id="donate">
    <div class="wrap">
      <ScrollReveal>
        <div class="donate__card">
          <div class="donate__body">
            <div class="donate__hearts">
              <Heart v-for="i in hearts" :key="i" :size="18 + (i % 3) * 6" :style="heartStyle(i)" />
            </div>
            <h2>
              {{ t('support.headPre') }}<span class="o">{{ t('support.headHl1') }}</span>{{ t('support.headMid') }}<span class="o">{{ t('support.headHl2') }}</span>
            </h2>
            <p>{{ t('support.body') }}</p>
            <BaseButton href="#" @click.prevent>{{ t('support.cta') }}</BaseButton>
          </div>
          <AppPhoto cls="donate__photo" :label="t('support.photoTag')" />
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

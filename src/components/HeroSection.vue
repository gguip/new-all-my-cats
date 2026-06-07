<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'
import { PawPad, PawPrint, CatStretch } from './Illustrations.vue'

const { t } = useI18n()

const paws = [
  { fur: '#2e2e2e', pad: '#f3bcc6', size: 132, style: { left: '-34px', top: '60px', transform: 'rotate(96deg)' } },
  { fur: '#f2873f', pad: '#7a3f1d', size: 120, style: { left: '-28px', top: '210px', transform: 'rotate(92deg)' } },
  { fur: '#8a5a3c', pad: '#e7cfa6', size: 120, style: { left: '-30px', top: '360px', transform: 'rotate(88deg)' } },
  { fur: '#2e2e2e', pad: '#f3bcc6', size: 132, style: { right: '-34px', top: '60px', transform: 'rotate(-96deg) scaleX(-1)' } },
  { fur: '#f2873f', pad: '#7a3f1d', size: 120, style: { right: '-28px', top: '210px', transform: 'rotate(-92deg) scaleX(-1)' } },
  { fur: '#8a5a3c', pad: '#e7cfa6', size: 120, style: { right: '-30px', top: '360px', transform: 'rotate(-88deg) scaleX(-1)' } },
]
const trail = [0, 1, 2, 3, 4]
</script>

<template>
  <section class="hero" id="top">
    <div class="hero__panel">
      <div class="hero__paws">
        <PawPad
          v-for="(p, i) in paws"
          :key="i"
          :fur="p.fur"
          :pad="p.pad"
          :size="p.size"
          class="hero__paw"
          :style="p.style"
        />
      </div>
      <div class="paw-trail">
        <PawPrint
          v-for="i in trail"
          :key="i"
          :size="22"
          :style="{ color: 'var(--cream-text)', opacity: 0.55, transform: `translateY(${i % 2 ? 8 : 0}px) rotate(-30deg)` }"
        />
      </div>
      <CatStretch :size="230" class="hero__cat" />
      <div class="hero__content">
        <h1 class="hero__title">{{ t('hero.title') }}</h1>
        <p class="hero__sub">{{ t('hero.sub') }}</p>
        <BaseButton href="#team" :style="{ marginTop: '6px' }">{{ t('hero.cta') }}</BaseButton>
      </div>
    </div>
  </section>
</template>

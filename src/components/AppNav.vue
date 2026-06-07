<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavScroll } from 'src/composables/useNavScroll'
import { LogoBlob } from './Illustrations.vue'

const { t, locale } = useI18n()
const { scrolled } = useNavScroll()
const open = ref(false)

const links = [
  { key: 'nav.theCats', href: '#team' },
  { key: 'nav.about', href: '#welcome' },
  { key: 'nav.support', href: '#donate' },
  { key: 'nav.sayHi', href: '#contact' },
] as const

const close = () => {
  open.value = false
}
const setLocale = (l: string) => {
  locale.value = l
}
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="nav__inner">
      <nav class="nav__links">
        <a v-for="l in links.slice(0, 2)" :key="l.key" class="nav__link" :href="l.href" @click="close">
          {{ t(l.key) }}
        </a>
      </nav>

      <a class="nav__logo" href="#top" :aria-label="t('a11y.home')"><LogoBlob /></a>

      <nav class="nav__links nav__links--r">
        <a v-for="l in links.slice(2)" :key="l.key" class="nav__link" :href="l.href" @click="close">
          {{ t(l.key) }}
        </a>
      </nav>

      <div class="nav__lang">
        <button :class="{ active: locale === 'pt-BR' }" @click="setLocale('pt-BR')">{{ t('lang.pt') }}</button>
        <button :class="{ active: locale === 'en' }" @click="setLocale('en')">{{ t('lang.en') }}</button>
      </div>

      <button class="nav__burger" :aria-label="t('a11y.menu')" @click="open = true"><span /></button>
    </div>

    <div class="drawer" :class="{ open }" @click="open = false">
      <div class="drawer__panel" @click.stop>
        <button class="drawer__close" :aria-label="t('a11y.close')" @click="open = false">×</button>
        <a v-for="l in links" :key="l.key" class="drawer__link" :href="l.href" @click="close">
          {{ t(l.key) }}
        </a>
        <div class="nav__lang" style="display: flex; margin-top: 18px; color: var(--cream-text)">
          <button :class="{ active: locale === 'pt-BR' }" @click="setLocale('pt-BR')">{{ t('lang.pt') }}</button>
          <button :class="{ active: locale === 'en' }" @click="setLocale('en')">{{ t('lang.en') }}</button>
        </div>
      </div>
    </div>
  </header>
</template>

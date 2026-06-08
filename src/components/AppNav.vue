<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavScroll } from 'src/composables/useNavScroll'
import { LogoMark, FlagBR, FlagEN, FlagES } from './Illustrations'

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
const scrollTo = (href: string, e: Event) => {
  e.preventDefault()
  close()
  const id = href.replace(/^#/, '')
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
const setLocale = (l: string) => {
  locale.value = l
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('catastrophe.locale', l)
  }
}
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="nav__inner">
      <nav class="nav__links">
        <a v-for="l in links.slice(0, 2)" :key="l.key" class="nav__link" :href="l.href" @click="scrollTo(l.href, $event)">
          {{ t(l.key) }}
        </a>
      </nav>

      <a class="nav__logo" href="#top" :aria-label="t('a11y.home')" @click="scrollTo('#top', $event)"><LogoMark /></a>

      <div class="nav__right">
        <nav class="nav__links nav__links--r">
          <a v-for="l in links.slice(2)" :key="l.key" class="nav__link" :href="l.href" @click="scrollTo(l.href, $event)">
            {{ t(l.key) }}
          </a>
          <router-link class="nav__link" to="/familia" @click="close">{{ t('nav.family') }}</router-link>
        </nav>

        <div class="nav__lang">
          <button
            class="nav__flag"
            :class="{ active: locale === 'pt-BR' }"
            :aria-label="t('lang.ptFull')"
            :aria-pressed="locale === 'pt-BR'"
            :title="t('lang.ptFull')"
            @click="setLocale('pt-BR')"
          >
            <FlagBR />
          </button>
          <button
            class="nav__flag"
            :class="{ active: locale === 'en' }"
            :aria-label="t('lang.enFull')"
            :aria-pressed="locale === 'en'"
            :title="t('lang.enFull')"
            @click="setLocale('en')"
          >
            <FlagEN />
          </button>
          <button
            class="nav__flag"
            :class="{ active: locale === 'es' }"
            :aria-label="t('lang.esFull')"
            :aria-pressed="locale === 'es'"
            :title="t('lang.esFull')"
            @click="setLocale('es')"
          >
            <FlagES />
          </button>
        </div>
      </div>

      <button class="nav__burger" :aria-label="t('a11y.menu')" @click="open = true"><span /></button>
    </div>

    <div class="drawer" :class="{ open }" @click="open = false">
      <div class="drawer__panel" @click.stop>
        <button class="drawer__close" :aria-label="t('a11y.close')" @click="open = false">×</button>
        <a v-for="l in links" :key="l.key" class="drawer__link" :href="l.href" @click="scrollTo(l.href, $event)">
          {{ t(l.key) }}
        </a>
        <router-link class="drawer__link" to="/familia" @click="close">{{ t('nav.family') }}</router-link>
        <div class="nav__lang drawer__lang">
          <button class="nav__flag" :class="{ active: locale === 'pt-BR' }" :aria-label="t('lang.ptFull')" :title="t('lang.ptFull')" @click="setLocale('pt-BR')">
            <FlagBR /><span>{{ t('lang.pt') }}</span>
          </button>
          <button class="nav__flag" :class="{ active: locale === 'en' }" :aria-label="t('lang.enFull')" :title="t('lang.enFull')" @click="setLocale('en')">
            <FlagEN /><span>{{ t('lang.en') }}</span>
          </button>
          <button class="nav__flag" :class="{ active: locale === 'es' }" :aria-label="t('lang.esFull')" :title="t('lang.esFull')" @click="setLocale('es')">
            <FlagES /><span>{{ t('lang.es') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

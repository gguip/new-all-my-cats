<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ScrollReveal from './ScrollReveal.vue'
import { LogoBlob, PawPrint, IconFacebook, IconInstagram, IconTiktok } from './Illustrations'

const { t } = useI18n()
</script>

<template>
  <section class="section contact" id="contact">
    <div class="wrap">
      <ScrollReveal>
        <h2 class="section-head">{{ t('contact.headPre') }}<span class="o">{{ t('contact.headHl') }}</span></h2>
      </ScrollReveal>
      <ScrollReveal>
        <div class="contact__grid">
          <div class="contact__col">
            <h4>{{ t('contact.col1Title') }}</h4>
            <p>{{ t('contact.col1Body') }}</p>
          </div>
          <div class="contact__col">
            <h4>{{ t('contact.col2Title') }}</h4>
            <p>{{ t('contact.col2Body') }}</p>
          </div>
          <div class="contact__col">
            <h4>{{ t('contact.col3Title') }}</h4>
            <p>{{ t('contact.col3Body') }}</p>
            <div class="socials">
              <a class="social" href="#" :aria-label="t('a11y.facebook')"><IconFacebook /></a>
              <a class="social" href="#" :aria-label="t('a11y.instagram')"><IconInstagram /></a>
              <a class="social" href="#" :aria-label="t('a11y.tiktok')"><IconTiktok /></a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>

    <footer class="footer">
      <PawPrint :size="40" class="decor" :style="{ left: '12%', top: '20px', color: 'rgba(255,255,255,.18)' }" />
      <PawPrint :size="28" class="decor" :style="{ right: '16%', bottom: '20px', color: 'rgba(255,255,255,.18)', transform: 'rotate(30deg)' }" />
      <div class="footer__inner">
        <LogoBlob />
        <p :style="{ fontSize: '14px', opacity: 0.85, marginTop: '12px' }">{{ t('footer.tagline') }}</p>
        <p :style="{ fontSize: '13px', opacity: 0.65, marginTop: '6px' }">{{ t('footer.copyright') }}</p>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LogoBlob } from 'src/components/Illustrations'

const { t } = useI18n()
</script>

<template>
  <div class="tbar">
    <router-link class="tbar__brand" to="/" :title="t('family.back')">
      <LogoBlob />
      <span class="tbar__title">{{ t('family.title') }}<small>{{ t('family.subtitle') }}</small></span>
    </router-link>
    <div class="tbar__spacer" />
    <div class="tbar__btns">
      <router-link class="tbtn tbtn--home" to="/">← {{ t('family.back') }}</router-link>
    </div>
  </div>
</template>

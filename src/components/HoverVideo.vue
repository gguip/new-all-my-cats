<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAutoplayVideo } from 'src/composables/useAutoplayVideo'

defineProps<{
  webm: string
  mp4: string
  cls?: string
  label?: string
}>()

const videoEl = ref<HTMLVideoElement | null>(null)

// Mute via property: the boolean `muted` attribute is not reliably reflected.
onMounted(() => {
  if (videoEl.value) videoEl.value.muted = true
})

useAutoplayVideo(videoEl)
</script>

<template>
  <div class="photo" :class="cls">
    <video
      ref="videoEl"
      class="hover-video"
      loop
      playsinline
      preload="metadata"
      :aria-label="label"
    >
      <source :src="webm" type="video/webm" />
      <source :src="mp4" type="video/mp4" />
    </video>
  </div>
</template>

<style scoped>
.hover-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>

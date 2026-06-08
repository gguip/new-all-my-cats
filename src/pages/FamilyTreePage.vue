<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FAMILY, type FamilyCat } from 'src/data/family'
import { buildTimeline } from 'src/lib/familyTimeline'
import FamilyTopBar from 'src/components/family/FamilyTopBar.vue'
import TimelineCard from 'src/components/family/TimelineCard.vue'
import TreeDetailPanel from 'src/components/family/TreeDetailPanel.vue'

const { t } = useI18n()
const buckets = buildTimeline(FAMILY)

const selName = ref<string | null>(null)
const selected = computed<FamilyCat | null>(() =>
  selName.value != null ? (FAMILY.find((c) => c.name === selName.value) ?? null) : null,
)

const yearLabel = (year: string): string => (year === '' ? t('family.noDate') : year)
</script>

<template>
  <div class="family-root">
    <FamilyTopBar />

    <div class="timeline" @click="selName = null">
      <section v-for="b in buckets" :key="b.year || 'nodate'" class="bucket">
        <h2 class="bucket__year">{{ yearLabel(b.year) }}</h2>

        <div class="bucket__cats">
          <TimelineCard
            v-for="c in b.cats"
            :key="c.name"
            :cat="c"
            :selected="c.name === selName"
            @select="selName = $event"
          />

          <div v-for="lit in b.litters" :key="lit.momName + lit.birth" class="litterbox">
            <span class="litterbox__label">{{ t('family.litterOf', { name: lit.momName }) }}</span>
            <div class="litterbox__cats">
              <TimelineCard
                v-for="k in lit.kittens"
                :key="k.name"
                :cat="k"
                :selected="k.name === selName"
                @select="selName = $event"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <TreeDetailPanel :cat="selected" :family="FAMILY" @close="selName = null" />
  </div>
</template>

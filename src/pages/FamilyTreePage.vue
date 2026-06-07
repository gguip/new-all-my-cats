<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FAMILY } from 'src/data/family'
import { layoutTree } from 'src/lib/familyLayout'
import { buildWires } from 'src/lib/familyWires'
import { useDragPan } from 'src/composables/useDragPan'
import FamilyTopBar from 'src/components/family/FamilyTopBar.vue'
import TreeNode from 'src/components/family/TreeNode.vue'
import TreeDetailPanel from 'src/components/family/TreeDetailPanel.vue'
import ZoomControls from 'src/components/family/ZoomControls.vue'

const { t } = useI18n()
const layout = layoutTree(FAMILY)
const wires = buildWires(layout)

const selId = ref<number | null>(null)
const zoom = ref(1)
const stageRef = ref<HTMLElement | null>(null)
useDragPan(stageRef)

const selected = computed<typeof FAMILY[number] | null>(() =>
  selId.value != null ? (layout.byId[selId.value] ?? null) : null,
)
const canvasStyle = computed(() => ({
  width: layout.width + 'px',
  height: layout.height + 'px',
  transform: `scale(${zoom.value})`,
}))
const zoomIn = () => {
  zoom.value = Math.min(1.6, +(zoom.value + 0.15).toFixed(2))
}
const zoomOut = () => {
  zoom.value = Math.max(0.5, +(zoom.value - 0.15).toFixed(2))
}
</script>

<template>
  <div class="family-root">
    <FamilyTopBar />

    <div ref="stageRef" class="stage" @click="selId = null">
      <div class="canvas grab" :style="canvasStyle">
        <svg
          class="wires"
          :width="layout.width"
          :height="layout.height"
          :viewBox="`0 0 ${layout.width} ${layout.height}`"
        >
          <path v-for="(d, i) in wires.parent" :key="'p' + i" class="wire" :d="d" />
          <path v-for="(d, i) in wires.partner" :key="'h' + i" class="wire wire--partner" :d="d" />
        </svg>
        <TreeNode
          v-for="c in FAMILY"
          :key="c.id"
          :cat="c"
          :x="layout.pos[c.id]?.x ?? 0"
          :y="layout.pos[c.id]?.y ?? 0"
          :selected="c.id === selId"
          @select="selId = $event"
        />
      </div>
    </div>

    <div class="hintchip"><b>{{ t('family.hintLabel') }}</b>{{ t('family.hint') }}</div>

    <ZoomControls @zoom-in="zoomIn" @zoom-out="zoomOut" />

    <TreeDetailPanel :cat="selected" :by-id="layout.byId" @close="selId = null" />
  </div>
</template>

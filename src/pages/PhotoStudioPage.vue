<!-- Dev-only tool to produce standardized 720x720 transparent cat photos. -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { env, AutoModel, AutoProcessor, RawImage } from '@huggingface/transformers'
import { CATS } from 'src/data/cats'
import { slugify } from 'src/utils/slugify'

// Fetch the RMBG-1.4 weights from the Hugging Face hub (not bundled locally).
env.allowLocalModels = false

const SIZE = 720

// Lazily load the RMBG-1.4 background-removal model + processor once, then reuse.
let modelPromise: Promise<[unknown, unknown]> | null = null
function getModel() {
  if (!modelPromise) {
    modelPromise = Promise.all([
      AutoModel.from_pretrained('briaai/RMBG-1.4'),
      AutoProcessor.from_pretrained('briaai/RMBG-1.4'),
    ])
  }
  return modelPromise
}

// Run RMBG-1.4 on a file and return a canvas holding the cut-out (transparent bg).
async function removeBackground(file: File): Promise<HTMLCanvasElement> {
  const [model, processor] = await getModel()
  const url = URL.createObjectURL(file)
  const image = await RawImage.fromURL(url)
  URL.revokeObjectURL(url)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pixel_values } = await (processor as any)(image)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { output } = await (model as any)({ input: pixel_values })
  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height)
  const c = document.createElement('canvas')
  c.width = image.width
  c.height = image.height
  const cx = c.getContext('2d')!
  cx.drawImage(image.toCanvas(), 0, 0)
  const pixels = cx.getImageData(0, 0, image.width, image.height)
  for (let i = 0; i < mask.data.length; i++) {
    pixels.data[4 * i + 3] = mask.data[i] ?? 0
  }
  cx.putImageData(pixels, 0, 0)
  return c
}

const catName = ref<string>(CATS[0]?.name ?? '')
const status = ref<string>('Selecione um gato e carregue uma foto.')
const busy = ref(false)
// When the loaded image already has its background removed (e.g. a PNG from an
// external tool), skip RMBG and just frame + export.
const skipRemoval = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)

// The cut-out subject and its current placement in the canvas.
let img: HTMLImageElement | null = null
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })

function draw() {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, SIZE, SIZE)
  if (!img) return
  ctx.drawImage(img, offset.value.x, offset.value.y, img.width * scale.value, img.height * scale.value)
}

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  busy.value = true
  try {
    let src: string
    if (skipRemoval.value) {
      // Image is already cut out: load it as-is, preserving transparency.
      status.value = 'Carregando imagem (fundo já removido)…'
      src = URL.createObjectURL(file)
    } else {
      status.value = 'Carregando modelo e removendo o fundo… (a 1ª vez baixa o modelo, pode demorar)'
      const cutout = await removeBackground(file)
      src = cutout.toDataURL()
    }
    const loaded = new Image()
    loaded.onload = () => {
      img = loaded
      // Fit the cutout height to the square, centered horizontally.
      scale.value = SIZE / loaded.height
      offset.value = { x: (SIZE - loaded.width * scale.value) / 2, y: 0 }
      draw()
      status.value = 'Arraste para posicionar, role o mouse para dar zoom, depois exporte.'
      busy.value = false
      if (skipRemoval.value) URL.revokeObjectURL(src)
    }
    loaded.src = src
  } catch (err) {
    status.value = 'Erro ao processar a imagem: ' + String(err)
    busy.value = false
  }
}

let dragging = false
let last = { x: 0, y: 0 }
function onDown(e: MouseEvent) {
  dragging = true
  last = { x: e.clientX, y: e.clientY }
}
function onMove(e: MouseEvent) {
  if (!dragging || !img) return
  const c = canvas.value!
  const ratio = SIZE / c.clientWidth // canvas pixels per CSS pixel
  offset.value = {
    x: offset.value.x + (e.clientX - last.x) * ratio,
    y: offset.value.y + (e.clientY - last.y) * ratio,
  }
  last = { x: e.clientX, y: e.clientY }
  draw()
}
function onUp() {
  dragging = false
}
function onWheel(e: WheelEvent) {
  if (!img) return
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.05 : 0.95
  // Zoom around the canvas center.
  const cx = SIZE / 2
  const cy = SIZE / 2
  offset.value = {
    x: cx - (cx - offset.value.x) * factor,
    y: cy - (cy - offset.value.y) * factor,
  }
  scale.value *= factor
  draw()
}

function exportWebp() {
  const c = canvas.value
  if (!c || !img) return
  c.toBlob(
    (blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${slugify(catName.value)}.webp`
      a.click()
      URL.revokeObjectURL(a.href)
    },
    'image/webp',
    0.92,
  )
}

onMounted(draw)
</script>

<template>
  <div class="studio">
    <h1>Photo Studio (dev)</h1>
    <p class="studio__status">{{ status }}</p>

    <div class="studio__controls">
      <label>
        Gato:
        <select v-model="catName">
          <option v-for="c in CATS" :key="c.name" :value="c.name">{{ c.name }}</option>
        </select>
      </label>
      <label class="studio__check">
        <input type="checkbox" v-model="skipRemoval" :disabled="busy" />
        Imagem já sem fundo (pular remoção)
      </label>
      <input type="file" accept="image/*" :disabled="busy" @change="onFile" />
      <button :disabled="busy" @click="exportWebp">Exportar {{ slugify(catName) }}.webp</button>
    </div>

    <div class="studio__stage">
      <canvas
        ref="canvas"
        :width="SIZE"
        :height="SIZE"
        @mousedown="onDown"
        @mousemove="onMove"
        @mouseup="onUp"
        @mouseleave="onUp"
        @wheel="onWheel"
      />
    </div>
  </div>
</template>

<style scoped>
.studio {
  max-width: 560px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: sans-serif;
}
.studio__status {
  color: #555;
}
.studio__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 16px 0;
}
.studio__stage {
  width: 360px;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  /* Same studio background as the real cards. */
  background: var(--tan, #f3dfba);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
.studio__stage canvas {
  width: 360px;
  height: 360px;
  cursor: grab;
  display: block;
}
.studio__stage canvas:active {
  cursor: grabbing;
}
</style>

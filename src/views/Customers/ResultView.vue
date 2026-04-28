<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gifshot from 'gifshot'
import QRCode from 'qrcode'
import { useBooth } from '../../composable/useBooth'

const { capturedPhotos, selectedTemplate } = useBooth()

const gifUrl = ref(null)
const qrCode = ref(null)
const shareUrl = ref('')

/* ─────────────────────────────
   GIF GENERATION
───────────────────────────── */
function generateGif() {
  gifshot.createGIF(
    {
      images: capturedPhotos.value,
      interval: 0.6,
      gifWidth: 200,
      gifHeight: 150
    },
    (obj) => {
      if (!obj.error) gifUrl.value = obj.image
    }
  )
}

/* ─────────────────────────────
   QR GENERATION
───────────────────────────── */
function generateQR() {
  const id = Math.random().toString(36).substring(2, 10)
  shareUrl.value = `${window.location.origin}/share/${id}`

  QRCode.toDataURL(shareUrl.value).then(url => {
    qrCode.value = url
  })
}

onMounted(() => {
  generateGif()
  generateQR()
})

/* ─────────────────────────────
   IMAGE LOADER
───────────────────────────── */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/* ─────────────────────────────
   OBJECT-FIT: COVER REPLACEMENT
───────────────────────────── */
function drawCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height
  const boxRatio = w / h

  let sx, sy, sw, sh

  if (imgRatio > boxRatio) {
    // crop left/right
    sh = img.height
    sw = img.height * boxRatio
    sx = (img.width - sw) / 2
    sy = 0
  } else {
    // crop top/bottom
    sw = img.width
    sh = img.width / boxRatio
    sx = 0
    sy = (img.height - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

/* ─────────────────────────────
   MAIN EXPORT ENGINE
───────────────────────────── */
async function download() {
  await nextTick()

  const template = selectedTemplate.value

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // base size (match your strip ratio)
  const width = 220
  const height = 660

  const scale = 3
  canvas.width = width * scale
  canvas.height = height * scale
  ctx.scale(scale, scale)

  // 1. draw frame background
  const frameImg = await loadImage(template.bg)
  ctx.drawImage(frameImg, 0, 0, width, height)

  // 2. draw photos
  for (let i = 0; i < template.position.length; i++) {
    const slot = template.position[i]
    const imgSrc = capturedPhotos.value[i]

    if (!imgSrc) continue

    const img = await loadImage(imgSrc)

    drawCover(
      ctx,
      img,
      slot.left ?? 35,
      slot.top,
      slot.width ?? 150,
      slot.height ?? 150
    )
  }

  // 3. export
  const link = document.createElement('a')
  link.download = 'photobooth.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div class="result">
    <div class="flex justify-between gap-x-12 items-center">

      <!-- LEFT: PREVIEW STRIP -->
      <div class="strip">
        <div class="strip-container">

          <img class="overlay-base" :src="selectedTemplate.bg" />

          <div class="photos">
            <div
              v-for="(slot, i) in selectedTemplate.position"
              :key="i"
              class="photo-slot"
              :style="{
                top: slot.top + 'px',
                left: '35px',
                width: '150px',
                height: '150px'
              }"
            >
              <img :src="capturedPhotos[i]" />
            </div>
          </div>

        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="right-panel">
        <img v-if="gifUrl" :src="gifUrl" class="gif-preview" />

        <div class="qr-section">
          <p class="label">Scan to download</p>
          <img v-if="qrCode" :src="qrCode" class="qr-img" />

          <button class="start-btn" @click="download">
            ⬇ Download
          </button>

          <a class="start-btn" href="/">Start Again</a>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.result {
  background: #7a0c0c;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ── STRIP ── */
.strip-container {
  position: relative;
  width: 220px;
  height: 660px;
}

.overlay-base {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 2;
}

/* ── PREVIEW PHOTOS ── */
.photos {
  inset: 0;
  z-index: 1;
}

.photo-slot {
  position: absolute;
  overflow: hidden;
  z-index: 2;
}

.photo-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── RIGHT SIDE ── */
.right-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.gif-preview {
  width: 260px;
  border-radius: 6px;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.label {
  color: white;
  font-size: 0.85rem;
}

.qr-img {
  width: 140px;
}

/* ── BUTTON ── */
.start-btn {
  padding: 10px 24px;
  border: 2px solid white;
  background: transparent;
  color: white;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s;
}

.start-btn:hover {
  background: white;
  color: #7a0c0c;
}
</style>
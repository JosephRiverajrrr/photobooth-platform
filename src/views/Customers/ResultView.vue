<script setup>
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import gifshot from 'gifshot'
import QRCode from 'qrcode'
import { useBooth } from '../../composable/useBooth'

const { capturedPhotos, selectedTemplate } = useBooth()

const gifUrl = ref(null)
const qrCode = ref(null)
const shareUrl = ref('')

function generateGif() {
  gifshot.createGIF(
    {
      images: capturedPhotos.value,
      interval: 0.6,
      gifWidth: 200,
      gifHeight: 150
    },
    function (obj) {
      if (!obj.error) {
        gifUrl.value = obj.image
      }
    }
  )
}

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

async function download() {
  const element = document.getElementById('photo-strip')
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 3,
    useCORS: true
  })
  const image = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = image
  link.download = 'photobooth.png'
  link.click()
}
</script>

<template>
  <div class="result">
    <div class="flex justify-between gap-x-12 items-center">

      <!-- LEFT: Photo Strip -->
      <div class="strip">
        <div id="photo-strip" class="strip-container">

          <!-- 🎨 OVERLAY is the BASE (film strip frame) -->
          <img
            class="overlay-base"
            :src="selectedTemplate.bg"
          />

          <!-- 📸 PHOTOS sit on top, clipped into the frame slots -->
      <div class="photos">
        <img
          v-for="(slot, i) in selectedTemplate.position"
          :key="i"  
          :src="capturedPhotos[i]"
          class="photo-img"
          :style="{
            top: slot.top + 'px',
            left: slot.left + 'px',
            width: slot.width + 'px',
            height: slot.height + 'px'
          }"
        />
      </div>

        </div>
      </div>

      <!-- RIGHT: GIF preview + QR -->
      <div class="right-panel">
        <div v-if="gifUrl">
          <img :src="gifUrl" class="gif-preview" />
        </div>

        <div class="qr-section">
          <p class="label">Scan to download</p>
          <img v-if="qrCode" :src="qrCode" class="qr-img" />
          <button class="start-btn" @click="download()">⬇ Download</button>
          <a class="start-btn" href="/">Start Again</a>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Layout ── */
.result {
  background: #7a0c0c;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ── Film Strip ── */
.strip-container {
  position: relative;
  width: 220px;
  /* Height matches your template image aspect ratio.
     Adjust if your bg image is a different size. */
  height: 660px;
}

/* The overlay IS the film strip — it fills the container */
.overlay-base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 0;
  pointer-events: none;
}

/* Photos layer — behind the overlay so the film border shows on top */
.photos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.photo-img {
  position: absolute;
  /* 
    These offsets match the 3 frame slots visible in your film strip template.
    The film strip has ~30px sprocket holes on each side, so photos start at x≈30px.
    Adjust top values to line up with YOUR specific template's frame positions.
  */
  left: 35px;
  width: 150px;   /* inner frame width (220 - 30px each side) */
  height: 150px;
  object-fit: unset;

}
.photo-img {
  position: absolute;
  object-fit: cover;
}
 
/* ── Right Panel ── */
.right-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.gif-preview {
  width: 260px;
  border-radius: 4px;
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

/* ── Buttons ── */
.start-btn {
  display: inline-block;
  margin-top: 4px;
  padding: 10px 24px;
  border: 2px solid white;
  background: transparent;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
  transition: background 0.3s, color 0.3s;
}

.start-btn:hover {
  background: white;
  color: #7a0c0c;
}
</style>
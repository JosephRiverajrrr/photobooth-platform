
<script setup>
import { ref, onMounted } from 'vue'
import { useBooth } from '../../composable/useBooth'
import { useRouter } from 'vue-router'

const video = ref(null)
const countdownDisplay = ref('')
const filter = ref('normal')
const cameraStarted = ref(false)

const { capturedPhotos, selectedTemplate } = useBooth()
const router = useRouter()

let stream = null

// 🎥 Start Camera
async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video: true })
  video.value.srcObject = stream
}

// 🎨 Filters
function setFilter(type) {
  filter.value = type

  const styles = {
    normal: 'none',
    bw: 'grayscale(100%)',
    sepia: 'sepia(100%)'
  }

  video.value.style.filter = styles[type]
}

// 📸 Take Photo
function takePhoto() {
  const canvas = document.createElement('canvas')
  canvas.width = video.value.videoWidth
  canvas.height = video.value.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.filter = video.value.style.filter || 'none'
  ctx.drawImage(video.value, 0, 0)

  capturedPhotos.value.push(canvas.toDataURL('image/png'))
}

// 🔁 Full Capture Sequence
async function captureSequence() {
  capturedPhotos.value = []

  cameraStarted.value = true;
  const total = selectedTemplate.value?.slots || 4

  for (let i = 0; i < total; i++) {
    for (let j = 3; j > 0; j--) {
      countdownDisplay.value = j
      await new Promise(r => setTimeout(r, 1000))
    }

    countdownDisplay.value = '📸'
    takePhoto()

    await new Promise(r => setTimeout(r, 700))
  }

  countdownDisplay.value = ''

  // 👉 go to result
  router.push('/result-view')
}

onMounted(() => {
  startCamera()
})
</script>

<template>
  <div class="camera-full">

    <!-- 🎥 Camera -->
    <video ref="video" autoplay playsinline class="video"></video>

    <!-- 🔴 Top Bar -->
    <div class="top-bar">
      <span>CAPTURE PHOTO</span>
    </div>

    <!-- ⏱ Countdown -->
    <div class="countdown" v-if="countdownDisplay">
      {{ countdownDisplay }}
    </div>

    <!-- 🎛 Floating Controls -->
    <div class="controls" >

      <!-- Filters -->
      <div class="filters" v-if="!cameraStarted">
        <button 
          :class="{ active: filter === 'normal' }"
          @click="setFilter('normal')"
        >Normal</button>

        <button 
          :class="{ active: filter === 'bw' }"
          @click="setFilter('bw')"
        >BW</button>

        <button 
          :class="{ active: filter === 'sepia' }"
          @click="setFilter('sepia')"
        >Sepia</button>
      </div>

      <!-- Capture -->
      <button class="capture-btn" @click="captureSequence" v-if="!cameraStarted">
        ●
      </button>

      <!-- Thumbnails -->
      <div class="preview-strip">
        <img 
          v-for="(img, i) in capturedPhotos" 
          :key="i" 
          :src="img"
        />
      </div>

    </div>

  </div>
</template>

<style scoped>
.camera-full {
  position: fixed;
  inset: 0;
  background: black;
  overflow: hidden;
}

/* 🎥 Video */
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 🔴 Top Bar */
.top-bar {
  position: absolute;
  top: 0;
  width: 100%;
  text-align: center;
  padding: 10px;
  color: white;
  border-bottom: 2px solid white;
  font-weight: bold;
  background: rgba(122, 12, 12, 0.6);
}

/* ⏱ Countdown */
.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  color: white;
  font-weight: bold;
}

/* 🎛 Controls */
.controls {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

/* 🎨 Filters */
.filters {
  display: flex;
  gap: 10px;
}

.filters button {
  padding: 6px 12px;
  border: 1px solid white;
  background: transparent;
  color: white;
  cursor: pointer;
}

.filters button.active {
  background: white;
  color: black;
}

/* 🔴 Capture Button */
.capture-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid white;
  background: var(--primary-red);
  color: white;
  font-size: 30px;
  cursor: pointer;
}

/* 🖼 Preview Strip */
.preview-strip {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding: 5px;
}

.preview-strip img {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border: 2px solid white;
}
</style>
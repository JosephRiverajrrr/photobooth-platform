

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBooth } from '../../composable/useBooth'

const templates = ref([
  {
    name: 'Blue Galaxy',
    slots: 3,
    bg: '/templates/blue.png',
    slots: [
      { top: 18, left: 35, width: 150, height: 150 },
      { top: 185, left: 35, width: 150, height: 150 },
      { top: 352, left: 35, width: 150, height: 150 }
    ]
  },
  {
    name: 'Film Strip',
    slots: 3,
    bg: '/templates/film.png',
    position: [
      { top: 18, left: 35, width: 150, height: 150 },
      { top: 185, left: 35, width: 150, height: 150 },
      { top: 352, left: 35, width: 150, height: 150 }
    ]
  },
  {
    name: 'IOS Music Player',
    slots: 3,
    bg: '/templates/ios-music.png',
    position: [
      { top: 18, left: 35, width: 150, height: 150 },
      { top: 185, left: 35, width: 150, height: 150 },
      { top: 352, left: 35, width: 150, height: 150 }
    ]
  },
  {
    name: 'Retro Red',
    slots: 3,
    bg: '/templates/red.png',
    position: [
      { top: 18, left: 35, width: 150, height: 150 },
      { top: 185, left: 35, width: 150, height: 150 },
      { top: 352, left: 35, width: 150, height: 150 }
    ]
  }
])

const router = useRouter()
const { selectedTemplate } = useBooth()

const selected = ref(null)

function selectTemplate(index) {
  selected.value = index
  selectedTemplate.value = templates.value[index]
}

function start() {
  if (selected.value === null) return

  router.push('/camera-view')
}
</script>


<template>
  <div class="layout">

    <!-- LEFT (Paper Section) -->
    <div class="paper">
      <div class="templates"> 
        <div 
          v-for="(template, i) in templates"
          :key="i"
          class="template-card"
          :class="{ active: selected === i }"
          @click="selectTemplate(i)"
        >
          <div class="mockup">
            <div 
              v-for="n in template.slots" 
              :key="n" 
              class="slot"
            ></div>
          </div>
          <p>{{ template.name }}</p>
        </div>
      </div>
    </div>

    <!-- RIGHT (Red Section) -->
    <div class="sidebar">
      <h4>YOUR CHOICE OF<br> TEMPLATE OR LAYOUT</h4>

      <h1>
        Tikwe<br>
        Retro Booth
      </h1>

      <button class="start-btn"  @click="start">
        START SESSION
      </button>
    </div>

  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* 🧻 LEFT SIDE */
.paper {
  flex: 1;
  background: var(--paper-bg);
  padding: 40px;
  position: relative;
  height: 100dv;
  overflow-y: auto;
}

/* paper texture feel */
.paper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, var(--paper-texture) 1px, transparent 1px);
  opacity: 0.2;
}

.templates {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  position: relative;
}

/* template card */
.template-card {
  background: white;
  padding: 15px;
  border: 2px solid var(--black);
  cursor: pointer;
  transition: 0.3s;
}

.template-card.active {
  border-color: var(--primary-red);
  transform: scale(1.05);
}

/* mockup grid */
.mockup {
  display: grid;
  gap: 5px;
}

.slot {
  height: 100px;
  background: #ddd;
  border: 1px solid #999;
}

/* 🟥 RIGHT SIDE */
.sidebar {
  width: 50%;
  background: var(--primary-red);
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sidebar h4 {
  font-size: 14px;
  letter-spacing: 2px;
  opacity: 0.8;
}

.sidebar h1 {
  font-size: 48px;
  margin: 30px 0;
  font-weight: 800;
}

/* CTA button */
.start-btn {
  padding: 15px;
  background: white;
  color: var(--primary-red);
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.start-btn:hover {
  background: #eee;
}
</style>

<script setup>
import { useRouter } from 'vue-router'
import { ref, nextTick } from 'vue'
const router = useRouter()
const codeLength = 6
const code = ref(Array(codeLength).fill(''))
const inputs = ref([])
const error = ref(false)

// 👉 Auto move next
function handleInput(index) {
  if (code.value[index] && index < codeLength - 1) {
    inputs.value[index + 1].focus()
  }
}

// 👉 Backspace go back
function handleBackspace(index) {
  if (!code.value[index] && index > 0) {
    inputs.value[index - 1].focus()
  }
}

// 👉 Start Session
function startSession() {
  const enteredCode = code.value.join('')

  if (enteredCode.length < codeLength) {
    error.value = true
    return
  }

  // simulate validation
  if (enteredCode !== '123456') {
    error.value = true
  } else {
    error.value = false
    alert('Access Granted 🎉')
    router.push('/select-template')
  }
}

// autofocus first input
nextTick(() => {
  inputs.value[0]?.focus()
})
</script>

<template>
  <div class="wrapper">

    <div class="card">
      <h2>WELCOME TO PHOTOBOOTH</h2>

      <p class="label">Enter Your Code</p>

      <!-- Code Inputs -->
      <div class="code-inputs">
        <input
          v-for="(digit, index) in code"
          :key="index"
          ref="inputs"
          maxlength="1"
          v-model="code[index]"
          @input="handleInput(index)"
          @keydown.backspace="handleBackspace(index)"
        />
      </div>

      <!-- Button -->
      <button class="start-btn" @click="startSession">
        START SESSION
      </button>

      <!-- Error -->
      <p v-if="error" class="error">
        ❌ Invalid / Used Code Message
      </p>
    </div>

  </div>
</template>


<style scoped>
.wrapper {
  height: 100vh;
  background: var(--primary-red);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

/* 🧻 Paper Card */
.card {
  background: var(--paper-bg);
  padding: 40px;
  width: 400px;
  border: 2px dashed var(--primary-red);
  text-align: center;
  position: relative;
}

/* torn effect */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid var(--black);
  pointer-events: none;
}

/* Title */
h2 {
  font-size: 16px;
  margin-bottom: 20px;
}

/* Label */
.label {
  margin-bottom: 10px;
}

/* 🔢 Code Inputs */
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.code-inputs input {
  width: 40px;
  height: 50px;
  text-align: center;
  font-size: 18px;
  border: none;
  border-bottom: 2px solid var(--black);
  background: transparent;
  outline: none;
}

/* ▶ Button */
.start-btn {
  margin-top: 20px;
  padding: 10px 20px;
  border: 2px solid var(--black);
  background: transparent;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.start-btn:hover {
  background: var(--primary-red);
  color: white;
}

/* ❌ Error */
.error {
  margin-top: 15px;
  color: var(--primary-red);
  font-size: 14px;
}
</style>
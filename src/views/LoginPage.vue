
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function login() {
  if (!email.value || !password.value) {
    error.value = 'Please fill all fields'
    return
  }

  // TEMP LOGIN
  if (email.value === 'admin@test.com' && password.value === 'admin') {
    router.push('/admin')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">

    <div class="bg-white p-8 rounded-2xl shadow w-[380px]">

      <h1 class="text-2xl text-black font-bold text-center mb-6">
        Admin Login
      </h1>

      <!-- Email -->
      <div class="mb-4">
        <label class="text-sm text-gray-600">Email</label>
        <InputText
          v-model="email"
          class="w-full mt-1 !bg-gray-100 border-gray-300 !text-black placeholder-gray-400" 
          placeholder="Enter email"
        />
      </div>

      <!-- Password -->
      <div class="mb-6">
        <label class="text-sm text-gray-600">Password</label>
        <InputText
          type="password"
          v-model="password" 
          class="w-full mt-1 !bg-gray-100 border-gray-300 text-black placeholder-gray-400"
          placeholder="Enter password"
        />
      </div>

      <!-- Button -->
      <Button
        label="Login" 
        class="w-full"
        @click="login"
      />

      <!-- Error -->
      <p v-if="error" class="text-red-500 text-sm mt-3 text-center">
        {{ error }}
      </p>

    </div>

  </div>
</template>
<style lang="scss"> 
.p-inputtext {
  color: #000 !important;
  background-color: unset !important; 
}
</style>
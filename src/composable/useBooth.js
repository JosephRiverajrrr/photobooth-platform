import { ref } from 'vue'

const selectedTemplate = ref(null)
const capturedPhotos = ref([])

export function useBooth() {
  return {
    selectedTemplate,
    capturedPhotos
  }
}
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectWarningStore = defineStore(
  'projectWarningStore',
  () => {
    const warnings = ref<Record<string, string>>({})

    const setWarning = (projectId: string, message: string) => {
      warnings.value[projectId] = message
    }

    const getWarning = (projectId: string) => {
      return warnings.value[projectId] || null
    }

    return { warnings, setWarning, getWarning }
  },
  {
    persist: true,
  },
)

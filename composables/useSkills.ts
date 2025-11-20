import { ref } from 'vue'
import { fetchPopularSkills } from '@@/services/external/skillsApi'

export function useSkills() {
  const skills = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadSkills = async () => {
    try {
      loading.value = true
      error.value = null
      skills.value = await fetchPopularSkills()
    } catch {
      error.value = 'Failed to load skills.'
    } finally {
      loading.value = false
    }
  }

  return { skills, loadSkills, loading, error }
}

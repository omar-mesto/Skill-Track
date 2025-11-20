import { ref } from 'vue'

export interface PositionTopic {
  name: string
  display_name: string | null
  short_description: string | null
}

export function usePositions() {
  const positions = ref<PositionTopic[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadPositions = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        'https://api.github.com/search/topics?q=developer',
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch positions')
      }

      const json = await response.json() as { items: PositionTopic[] }
      positions.value = json.items
    } catch {
      error.value = 'Failed to load positions.'
      positions.value = []
    } finally {
      loading.value = false
    }
  }

  return { positions, loadPositions, loading, error }
}

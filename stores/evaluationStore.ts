import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AIEvaluationModel } from '~/models/professorEvaluationModel'

export const useEvaluationStore = defineStore(
  'evaluationStore',
  () => {
    const aiEvaluation = ref<{
      userId: string
      evaluation: AIEvaluationModel
      updatedAt: string
    } | null>(null)

    const setAIEvaluation = (
      userId: string,
      data: {
        evaluation: AIEvaluationModel
      } | AIEvaluationModel,
    ) => {
      aiEvaluation.value = {
        userId,
        evaluation: 'evaluation' in data ? data.evaluation : data,
        updatedAt: new Date().toISOString(),
      }
    }

    const clearAIEvaluation = () => {
      aiEvaluation.value = null
    }

    return {
      aiEvaluation,
      setAIEvaluation,
      clearAIEvaluation,
    }
  },
  {
    persist: {
      pick: ['aiEvaluation'],
    },
  },
)

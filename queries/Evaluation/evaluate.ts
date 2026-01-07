import { useAPI } from '@@/services/baseApi'
import type { EvaluatePayload } from '~/models/EvaluateModel'
import type { AIEvaluationModel, ProfessorEvaluationModel } from '~/models/professorEvaluationModel'

export const useGetProfessorEvaluation = () => {
  return useAPI<ProfessorEvaluationModel>({
    url: '/evaluate/me',
    queryKey: 'professor-evaluation',
    type: 'GET',
  })
}

export const useGetAIEvaluation = () => {
  return useAPI<{
    success: boolean
    message: string
    data: AIEvaluationModel
  }>({
    url: '/evaluate/ai/evaluate-profile',
    queryKey: 'ai-evaluation',
    type: 'GET',
    isLazy: true,
  })
}

export const useProfessorEvaluateStudent = () => {
  return useAPI({
    url: '/evaluate',
    type: 'POST',
    queryKey: 'professor-evaluation',
    immediate: false,
  })
}

import { useAPI } from '@@/services/baseApi'
import type { AIEvaluationModel, ProfessorEvaluationItem, ProfessorEvaluationModel } from '~/models/professorEvaluationModel'

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

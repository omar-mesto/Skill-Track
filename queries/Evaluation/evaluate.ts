import { useAPI } from '@@/services/baseApi'
import type { AIEvaluationModel, ProfessorEvaluationModel } from '~/models/professorEvaluationModel'

export const useGetProfessorEvaluation = (studentId?: string) => {
  const url = `/evaluate/student/${studentId}`

  return useAPI<ProfessorEvaluationModel>({
    url: url,
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

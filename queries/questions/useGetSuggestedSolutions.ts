import { useAPI } from '@@/services/baseApi'

export const useGetSuggestedSolutions = (questionId: string) => {
  return useAPI({
    url: `/question/suggested-solutions/${questionId}`,
    type: 'GET',
    queryKey: `suggested-solutions-${questionId}`,
    immediate: false,
  })
}

import { useAPI } from '@@/services/baseApi'
import type { RecommendationsResponse } from '@@/models/recommendationModel'

export const useGetRecommendations = (
  userId: string,
  page: number,
  limit = 10,
) => {
  return useAPI<RecommendationsResponse>({
    url: `/recommendations/${userId}?page=${page}&limit=${limit}`,
    type: 'GET',
    queryKey: `recommendations-${page}`,
  })
}

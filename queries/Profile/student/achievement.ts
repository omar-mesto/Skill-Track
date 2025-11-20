import { useAPI } from '@@/services/baseApi'
import type { CreateAchievementResponse, GetAchievementsResponse } from '~/models/AchievementModel'

export const useGetAchievements = () => {
  return useAPI<GetAchievementsResponse>({
    url: '/profile/get/Achievement',
    queryKey: 'achievements',
    type: 'GET',
  })
}

export const useCreateAchievement = (payload: FormData) => {
  return useAPI<CreateAchievementResponse>({
    url: '/profile/create/Achievement',
    payload,
    type: 'POST',
    queryKey: 'achievements',
  })
}

export const useUpdateAchievement = (id: string, payload: FormData) => {
  return useAPI({
    url: `/profile/update/Achievement/${id}`,
    payload,
    type: 'PUT',
    queryKey: 'achievements',
  })
}

export const useDeleteAchievement = (id: string) => {
  return useAPI({
    url: `/profile/delete/Achievement/${id}`,
    type: 'DELETE',
    queryKey: 'achievements',
  })
}

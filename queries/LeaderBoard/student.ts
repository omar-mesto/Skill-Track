import { useAPI } from '@@/services/baseApi'
import type { StudentLeaderboardItem } from '~/models/studentLeaderboard'

export interface GetStudentsLeaderboardResponse {
  success: boolean
  message: string
  data: StudentLeaderboardItem[]
}

export const useGetStudentsLeaderboard = () => {
  return useAPI<GetStudentsLeaderboardResponse>({
    url: '/leaderboard',
    type: 'GET',
    queryKey: 'students-leaderboard',
  })
}

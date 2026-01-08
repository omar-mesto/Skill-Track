import { useAPI } from '@@/services/baseApi'
import type { LeaderboardResponse } from '~/models/professorLeaderboard'

export const useGetProfessorsLeaderboard = () => {
  return useAPI<LeaderboardResponse>({
    url: '/leaderboard/professors',
    queryKey: 'professors-leaderboard',
    type: 'GET',
  })
}

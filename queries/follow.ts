import { useAPI } from '@@/services/baseApi'
import type { FollowListResponse } from '~/models/followModel'

export const useFollowUser = (userId: string) => {
  return useAPI({
    url: `/follow/${userId}/follow`,
    type: 'POST',
    queryKey: 'follow-action',
  })
}

export const useGetFollowers = (userId: string) => {
  return useAPI<FollowListResponse>({
    url: `/follow/${userId}/followers`,
    type: 'GET',
    queryKey: `followers-${userId}`,
  })
}

export const useGetFollowing = (userId: string) => {
  return useAPI<FollowListResponse>({
    url: `/follow/${userId}/following`,
    type: 'GET',
    queryKey: `following-${userId}`,
  })
}

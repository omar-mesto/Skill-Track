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

export const useUnfollowUser = (userId: string) => {
  return useAPI({
    url: `/follow/${userId}/unfollow`,
    type: 'DELETE',
    queryKey: 'unfollow-action',
  })
}

export const useGetFollowing = (userId: string) => {
  return useAPI<FollowListResponse>({
    url: `/follow/${userId}/following`,
    type: 'GET',
    queryKey: `following-${userId}`,
  })
}

export const useCheckFollow = async (targetId: string) => {
  const { data } = await useAPI<{
    success: boolean
    data: {
      isFollowing: boolean
      isFollower: boolean
    }
  }>({
    url: `/follow/check/${targetId}`,
    type: 'GET',
    queryKey: `check-follow`,
  })

  return {
    isFollowing: !!data.value?.data.isFollowing,
    isFollower: !!data.value?.data.isFollower,
  }
}

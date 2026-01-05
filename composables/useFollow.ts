import { computed } from 'vue'
import { useFollowUser, useGetFollowers } from '@@/queries/follow'

export function useFollow(targetUserId: string, currentUserId: string) {
  const { data } = useGetFollowers(targetUserId)

  const followers = computed(() => data.value?.data?.data ?? [])

  const isFollowing = computed(() => {
  return followers.value.some(f => {
    if (typeof f.follower === 'string') return f.follower === currentUserId

    return f.follower._id === currentUserId
  })
})

  const follow = async () => {
  const { execute, status } = useFollowUser(targetUserId)
  await execute()

  if (status.value === 'success') {
    refreshNuxtData(`followers-${targetUserId}`)
  }
}

  return { followers, isFollowing, follow }
}

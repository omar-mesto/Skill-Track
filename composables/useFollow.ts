import { computed } from 'vue'
import { useFollowUser, useGetFollowers } from '@@/queries/follow'

export function useFollow(targetUserId: string, currentUserId: string) {
  const { data, refresh } = useGetFollowers(targetUserId)

  const followers = computed(() => data.value?.data?.data ?? [])

  const isFollowing = computed(() => {
  return followers.value.some(f => f.follower._id === currentUserId)
})

  const follow = async () => {
    const { execute, status } = useFollowUser(targetUserId)
    await execute()
    if (status.value === 'success') refresh()
  }

  return { followers, isFollowing, follow }
}

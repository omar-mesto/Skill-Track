<script setup lang="ts">
import { useCheckFollow, useFollowUser, useUnfollowUser } from '@@/queries/follow'
import type { ProfessorProfileData } from '~/models/profileInformationModel'

const props = defineProps<{
  profile: ProfessorProfileData | null
  isOwner: boolean
}>()

const isFollowing = ref(false)
const loading = ref(false)

watch(
  () => profile?.user._id,
  async id => {
    if (!props.isOwner) {
      const res = await useCheckFollow(id)
      isFollowing.value = res.isFollowing
    }
  },
  { immediate: true },
)

const followApi = useFollowUser(props.profile.user._id)
const unfollowApi = useUnfollowUser(props.profile.user._id)
const toggleFollow = async () => {
  if (loading.value) return

  loading.value = true
  if (isFollowing.value) {
    await unfollowApi.execute()
    isFollowing.value = false
  } else {
    await followApi.execute()
    isFollowing.value = true
  }
  loading.value = false
}
</script>

<template>
  <div class="flex justify-end gap-3 p-4">
    <UButton
      v-if="!isOwner"
      :loading="loading"
      @click="toggleFollow"
    >
      {{ isFollowing ? 'إلغاء المتابعة' : 'متابعة' }}
    </UButton>

    <UButton v-if="isOwner">
      QR
    </UButton>
    <UButton v-if="isOwner">
      Edit Profile
    </UButton>
  </div>
</template>

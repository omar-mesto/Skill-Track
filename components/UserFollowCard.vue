<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFollowUser } from '@@/queries/follow'

const props = defineProps<{
  user: {
    _id: string
    name: string
    email: string
    avatar: string | null
    role: 'student' | 'professor' | 'company'
    isFollowing?: boolean
  }
}>()

const router = useRouter()
const isFollowing = ref(!!props.user.isFollowing)
const isLoading = ref(false)

function goToProfile() {
  const userId = props.user._id
  const role = props.user.role

  if (role === 'student') {
    router.push(`/profile/student/${userId}`)
  }
  else if (role === 'professor') {
    router.push(`/profile/professor?id=${userId}`)
  }
  else if (role === 'company') {
    router.push(`/profile/company?id=${userId}`)
  }
}

const toggleFollow = async (e: MouseEvent) => {
  e.stopPropagation()

  if (isLoading.value) return
  isLoading.value = true

  if (!isFollowing.value) {
    await useFollowUser(props.user._id)
    isFollowing.value = true
  }

  isLoading.value = false
}
</script>

<template>
  <div
    class="bg-white rounded-xl p-4 shadow-sm space-y-4 cursor-pointer hover:bg-slate-50 transition"
    @click="goToProfile"
  >
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <UUser
        class="flex-1 min-w-0"
        :name="user.name"
        :avatar="{
          src: user.avatar
            ? 'http://localhost:5000/' + user.avatar
            : '/StudentLogin.png',
        }"
        size="xl"
        :ui="{ name: 'text-black font-bold truncate' }"
      >
        <template #description>
          <div class="flex flex-col gap-1">
            <span class="text-gray-500 truncate">{{ user.email }}</span>
            <UBadge
              size="xs"
              variant="soft"
              :color="user.role === 'professor' ? 'primary' : 'info'"
              class="capitalize w-fit"
            >
              {{ user.role }}
            </UBadge>
          </div>
        </template>
      </UUser>

      <UButton
        class="hidden sm:inline-flex shrink-0 rounded-full px-6"
        size="sm"
        :loading="isLoading"
        :color="isFollowing ? 'info' : 'primary'"
        variant="soft"
        @click="toggleFollow"
      >
        {{ isFollowing ? 'Following' : 'Follow' }}
      </UButton>
    </div>

    <UButton
      class="sm:hidden w-full rounded-full"
      size="sm"
      :loading="isLoading"
      :color="isFollowing ? 'info' : 'primary'"
      variant="soft"
      @click="toggleFollow"
    >
      Follow
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useGetFollowers, useGetFollowing } from '@@/queries/follow'
import { computed } from 'vue'
import type { FollowUser } from '~/models/followModel'

const props = defineProps<{ userId: string }>()
const router = useRouter()

const { data: dataFollowers } = useGetFollowers(props.userId)
const followers = computed(() => dataFollowers.value?.data?.data ?? [])

const { data } = useGetFollowing(props.userId)
const following = computed(() => data.value?.data?.data ?? [])

function getUserId(user: string | FollowUser) {
  return typeof user === 'string' ? user : user._id
}

function goToProfile(user: FollowUser | string) {
  if (typeof user === 'string') {
    router.push(`/profile/student/${user}`)

    return
  }

  const userId = user._id
  const role = user.role

  if (role === 'student') {
    router.push(`/profile/student/${userId}`)
  }
  else if (role === 'professor') {
    router.push(`/profile/professor/${userId}`)
  }
  else if (role === 'company') {
    router.push(`/profile/company/${userId}`)
  }
}

const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'professor': return 'success'
    case 'student': return 'info'
    case 'company': return 'warning'
    case 'admin': return 'error'
    default: return 'info'
  }
}
</script>

<template>
  <div class="sm:flex block gap-5 justify-between">
    <div class="text-black sm:w-1/2 w-full">
      <h3 class="text-xl font-bold">
        Followers
      </h3>

      <div class="space-y-3 mt-3">
        <div
          v-for="f in followers"
          :key="f._id"
          class="p-3 border rounded-xl bg-background text-black hover:cursor-pointer"
          @click="goToProfile(f.follower)"
        >
          <UUser
            class="items-center"
            :name="typeof f.follower === 'object' ? f.follower.name : ''"
            :avatar="{
              src: typeof f.follower === 'object'
                ? (f.follower.avatar
                  ? 'https://skill-track-gr0b.onrender.com/' + f.follower.avatar
                  : '/StudentLogin.png')
                : '/StudentLogin.png',
            }"
            size="xl"
            :ui="{ name: 'text-black font-bold' }"
          >
            <template #description>
              <div class="flex flex-col gap-1">
                <span class="text-gray-500">{{ typeof f.follower === 'object' ? f.follower.email : '' }}</span>

                <div
                  v-if="typeof f.follower === 'object' && f.follower.role"
                  class="mt-1"
                >
                  <UBadge
                    size="xs"
                    variant="soft"
                    :color="f.follower.role === 'professor' ? 'primary' : 'info'"
                    class="capitalize"
                  >
                    {{ f.follower.role }}
                  </UBadge>
                </div>
              </div>
            </template>
          </UUser>
        </div>
      </div>
    </div>
    <div class="text-black sm:w-1/2 w-full sm:my-0 my-5">
      <h3 class="text-xl font-bold">
        Following
      </h3>

      <div class="space-y-3 mt-3 container">
        <div
          v-for="f in following"
          :key="f._id"
          class="p-3 border rounded-xl bg-background text-black hover:cursor-pointer"
          @click="goToProfile(f.following)"
        >
          <UUser
            class="items-center"
            :name="typeof f.following === 'object' ? f.following.name : ''"
            :avatar="{
              src: typeof f.following === 'object'
                ? (f.following.avatar
                  ? 'https://skill-track-gr0b.onrender.com/' + f.following.avatar
                  : '/StudentLogin.png')
                : '/StudentLogin.png',
            }"
            size="xl"
            :ui="{
              name: 'text-black font-bold',
              wrapper: 'gap-3',
            }"
          >
            <template #description>
              <div class="flex flex-col gap-1.5">
                <span class="text-sm text-gray-500">
                  {{ typeof f.following === 'object' ? f.following.email : '' }}
                </span>

                <div v-if="typeof f.following === 'object' && f.following.role">
                  <UBadge
                    :label="f.following.role"
                    size="xs"
                    variant="subtle"
                    :color="getRoleColor(f.following.role)"
                    class="capitalize px-2 rounded-md"
                  />
                </div>
              </div>
            </template>
          </UUser>
        </div>
      </div>
    </div>
  </div>
</template>

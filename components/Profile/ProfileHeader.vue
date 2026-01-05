<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileResponse } from '@@/models/profileInformationModel'

const API_BASE_URL = 'http://localhost:5000/'

const props = defineProps<{
  profile: ProfileResponse['data'] | null
  imageVersion: number
}>()

const normalize = (path?: string | null) =>
  path ? path.replace(/\\/g, '/') : null

const coverUrl = computed(() => {
  const p = props.profile?.user?.coverImage
  const n = normalize(p)

  return n
    ? `${API_BASE_URL}${n}?v=${props.imageVersion}`
    : '/coverImage.jpg'
})

const avatarUrl = computed(() => {
  const p = props.profile?.user?.avatar
  const n = normalize(p)

  return n
    ? `${API_BASE_URL}${n}?v=${props.imageVersion}`
    : '/StudentLogin.png'
})
</script>

<template>
  <div class="relative w-full">
    <div class="w-full h-40 sm:h-48 md:h-60 lg:h-60 overflow-hidden">
      <img
        :src="coverUrl"
        class="w-full h-full object-fill"
      >
    </div>

    <div
      class="absolute left-5 sm:left-26 -bottom-12 sm:-bottom-16
        w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden
        border-4 border-white shadow-xl bg-white"
    >
      <img
        :src="avatarUrl"
        class="w-full h-full object-cover"
      >
    </div>
  </div>
</template>

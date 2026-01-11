<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileResponse } from '@@/models/profileInformationModel'

const BASE = 'https://skill-track-gr0b.onrender.com/'

const props = defineProps<{
  profile: ProfileResponse['data'] | null
  imageVersion: number
}>()

const avatar = computed(() =>
  props.profile?.user?.avatar
    ? `${BASE}${props.profile.user.avatar}?v=${props.imageVersion}`
    : '/default-avatar.png',
)

const cover = computed(() =>
  props.profile?.user?.coverImage
    ? `${BASE}${props.profile.user.coverImage}?v=${props.imageVersion}`
    : '/coverImage.jpg',
)
</script>

<template>
  <div class="relative">
    <img
      :src="cover"
      class="w-full h-56 object-cover"
    >

    <div class="absolute left-6 -bottom-12 w-28 h-28 rounded-full border-4 bg-white overflow-hidden">
      <img
        :src="avatar"
        class="w-full h-full object-cover"
      >
    </div>
  </div>
</template>

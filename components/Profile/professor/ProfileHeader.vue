<script setup lang="ts">
import { computed } from 'vue'
import type { ProfessorProfileData } from '~/models/profileInformationModel'

const props = defineProps<{
  profile: ProfessorProfileData
  imageVersion: number
}>()

const emit = defineEmits(['open-sidebar'])

const BASE = 'http://localhost:5000/'

const avatar = computed(() =>
  props?.profile?.profile?.user?.avatar
    ? `${BASE}${props.profile?.profile?.user?.avatar}?v=${props.imageVersion}`
    : '/default-avatar.png',
)

const cover = computed(() =>
  props?.profile?.profile?.user?.coverImage
    ? `${BASE}${props.profile?.profile?.user?.coverImage}?v=${props.imageVersion}`
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

    <button
      class="absolute top-4 left-4 md:hidden"
      @click="emit('open-sidebar')"
    >
      ☰
    </button>
  </div>
</template>

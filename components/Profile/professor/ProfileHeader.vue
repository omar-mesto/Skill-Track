<script setup lang="ts">
import { computed } from 'vue'
import type { ProfessorProfileData } from '~/models/profileInformationModel'

const props = defineProps<{
  profile: ProfessorProfileData
  imageVersion: number
}>()

const emit = defineEmits(['open-sidebar'])

const BASE = 'http://localhost:5000/'

const hasAvatar = computed(() =>
  !!props.profile?.profile?.user?.avatar,
)

const hasCover = computed(() =>
  !!props.profile?.profile?.user?.coverImage,
)

const avatar = computed(() =>
  hasAvatar.value
    ? `${BASE}${props.profile.profile.user.avatar}?v=${props.imageVersion}`
    : '',
)

const cover = computed(() =>
  hasCover.value
    ? `${BASE}${props.profile.profile.user.coverImage}?v=${props.imageVersion}`
    : '',
)
</script>

<template>
  <div class="relative">
    <div class="w-full h-56">
      <img
        v-if="hasCover"
        :src="cover"
        class="w-full h-56 object-cover"
      >
      <div
        v-else
        class="w-full h-56 bg-gray-200 animate-pulse"
      />
    </div>
    <div
      class="absolute left-6 -bottom-12 w-28 h-28 rounded-full border-4 bg-white overflow-hidden"
    >
      <img
        v-if="hasAvatar"
        :src="avatar"
        class="w-full h-full object-cover"
      >
      <div
        v-else
        class="w-full h-full bg-gray-200 animate-pulse"
      />
    </div>

    <UButton
      variant="ghost"
      color="info"
      class="absolute top-4 left-4 md:hidden"
      @click="emit('open-sidebar')"
    >
      <UIcon
        name="i-heroicons-bars-3"
        class="w-6 h-6"
      />
    </UButton>
  </div>
</template>

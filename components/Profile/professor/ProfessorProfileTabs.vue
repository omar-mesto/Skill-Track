<script setup lang="ts">
import type { ProfessorProfileData } from '~/models/profileInformationModel'

const props = defineProps<{
  profile: ProfessorProfileData | null
  isOwner: boolean
}>()
</script>

<template>
  <UTabs
    :items="[
      { label: 'Posts', slot: 'posts' },
      { label: 'Following', slot: 'following' },
    ]"
  >
    <template #posts>
      <div>Posts here</div>
    </template>

    <template #following>
      <div>Following list</div>
    </template>
  </UTabs>
</template>

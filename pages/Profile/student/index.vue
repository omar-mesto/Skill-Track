<script setup lang="ts">
import ProfileHeader from '@@/components/Profile/ProfileHeader.vue'

const { profile } = useProfile()
</script>

<template>
  <div class="w-full min-h-screen bg-white pb-20">
    <ProfileHeader
      :key="profile?.user?.avatar + '-' + profile?.user?.coverImage"
    />
    <div class="mx-4 md:mx-20 bg-background shadow-2xl rounded-b-xl p-5">
      <ProfileInformation />
      <ProfileTabs />
    </div>
  </div>
</template>

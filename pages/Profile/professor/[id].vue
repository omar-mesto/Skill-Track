<script setup lang="ts">
import ProfileHeader from '@@/components/Profile/ProfileHeader.vue'
import ProfileSidebar from '@@/components/layout/ProfileSidebar.vue'
import { useProfile } from '@@/composables/useProfile'

const { profile, isOwner, refresh } = useProfile()
const imageVersion = ref(Date.now())

await refresh()
imageVersion.value = Date.now()
const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB]">
    <ProfileSidebar
      v-if="isOwner"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <main class="flex-1 mb-6">
      <ProfileHeader
        :profile="profile"
        :image-version="imageVersion"
      />

      <div class="mx-4 md:mx-20 bg-white shadow-2xl rounded-b-xl p-5">
        <ProfileInformation
          :readonly="!isOwner"
          @open-sidebar="sidebarOpen = true"
        />

        <ProfileTabs
          :user-id="profile?.user?._id"
          :readonly="!isOwner"
          :is-owner="isOwner"
        />
      </div>
    </main>
  </div>
</template>

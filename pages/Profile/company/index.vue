<script setup lang="ts">
import { ref } from 'vue'
import ProfileCompanyTabs from '@@/components/Profile/ProfileCompanyTabs.vue'
import ProfileSidebar from '@@/components/layout/ProfileSidebar.vue'

const sidebarOpen = ref(false)

const { profile, isOwner, imageVersion, refresh, isLoading } = useCompanyProfile()

const handleUpdated = async () => {
  await refresh()
  imageVersion.value = Date.now()
}
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB]">
    <ProfileSidebar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <main class="flex-1">
      <ProfileCompanyProfileHeader
        :profile="profile"
        :image-version="imageVersion"
        @open-sidebar="sidebarOpen = true"
      />

      <div
        v-if="isLoading"
        class="mx-4 md:mx-20 mt-6"
      >
        <div class="animate-pulse space-y-4 bg-white shadow rounded-b-xl p-5">
          <div class="h-6 w-1/3 bg-gray-200 rounded" />
          <div class="h-4 w-1/2 bg-gray-200 rounded" />
          <div class="h-4 w-2/3 bg-gray-200 rounded" />
          <div class="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>

      <div
        v-else
        class="mx-4 md:mx-20 bg-white shadow rounded-b-xl p-5"
      >
        <ProfileCompanyInformation
          :profile="profile"
          :is-owner="isOwner"
          @updated="handleUpdated"
        />

        <ProfileCompanyTabs
          :user-id="profile?.profile.user._id"
          :readonly="!isOwner"
          :is-owner="isOwner"
        />
      </div>
    </main>
  </div>
</template>

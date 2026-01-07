<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import ProfileHeader from '@@/components/Profile/ProfileHeader.vue'
import ProfileSidebar from '@@/components/layout/ProfileSidebar.vue'
import ProfileInformation from '@@/components/Profile/ProfileInformation.vue'
import ProfileTabs from '@@/components/Profile/ProfileTabs.vue'

import { useProfile } from '@@/composables/useProfile'
import { useGlobalStore } from '@@/stores/global'

const route = useRoute()
const store = useGlobalStore()
const sidebarOpen = ref(false)

const userId = computed(() => {
  return (route.params.id as string | undefined) || store.id
})

const { profile, isOwner, refresh } = useProfile(userId.value)

const currentUser = computed(() => ({
  _id: store.id,
  role: store.role,
}))
const imageVersion = ref(Date.now())
watch(profile, () => {
  imageVersion.value = Date.now()
})
watch(
  () => route.params.id,
  async () => {
    await refresh()
  },
)
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB] w">
    <ProfileSidebar
      v-if="isOwner"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <main class="flex-1 mb-6">
      <ProfileHeader
        :profile="profile"
        :image-version="imageVersion"
        :is-owner="isOwner"
        @open-sidebar="sidebarOpen = true"
      />

      <div class="mx-4 md:mx-20 bg-white shadow-2xl rounded-b-xl p-5">
        <ProfileInformation
          :profile="profile"
          :current-user="currentUser"
          :is-owner="isOwner"
          @updated="refresh"
          @open-sidebar="sidebarOpen = true"
        />

        <ProfileTabs
          v-if="profile?.user?._id"
          :user-id="profile.user._id"
          :readonly="!isOwner"
          :is-owner="isOwner"
        />
      </div>
    </main>
  </div>
</template>

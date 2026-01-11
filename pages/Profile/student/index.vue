<script setup lang="ts">
import { ref, computed } from 'vue'
import ProfileHeader from '@@/components/Profile/ProfileHeader.vue'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'

const route = useRoute()
const sidebarOpen = ref(false)
const query = computed(() => route.query as { id?: string })
const userId = computed(() => query.value.id)
const { profile, refresh } = useProfile(userId.value)
const imageVersion = ref(0)
const onProfileUpdated = async () => {
  await refresh()
  imageVersion.value = Date.now()
}
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB] min-w-xl">
    <ProfileSidebar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <main class="flex-1 mb-6">
      <ProfileHeader
        :key="imageVersion"
        :profile="profile"
        :image-version="imageVersion"
        @updated="onProfileUpdated"
      />

      <div class="mx-4 md:mx-20 bg-white shadow-2xl rounded-b-xl p-5">
        <ProfileInformation
          :is-owner="true"
          :current-user="profile?.user"
          @open-sidebar="sidebarOpen = true"
          @updated="onProfileUpdated"
        />
        <ProfileTabs
          :is-owner="true"
        />
      </div>
    </main>
  </div>
</template>

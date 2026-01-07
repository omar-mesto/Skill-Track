<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfessorProfileHeader from '@@/components/Profile/professor/ProfileHeader.vue'
import ProfessorProfileInformation from '@@/components/Profile/professor/ProfileProfessorInformation.vue'
import ProfileProfessorTabs from '@@/components/Profile/ProfileProfessorTabs.vue'
import ProfileSidebar from '@/components/layout/ProfileSidebar.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const userId = computed(() => route.params.id as string | undefined)
const { profile, isOwner, imageVersion, refresh, isLoading } = useProfessorProfile(userId.value)

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
      <ProfessorProfileHeader
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
        <ProfessorProfileInformation
          :profile="profile"
          :is-owner="isOwner"
          @updated="handleUpdated"
        />

        <ProfileProfessorTabs
          :user-id="profile?.user?._id"
          :readonly="!isOwner"
          :is-owner="isOwner"
        />
      </div>
    </main>
  </div>
</template>

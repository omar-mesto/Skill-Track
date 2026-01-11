<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileSidebar from '@/components/layout/ProfileSidebar.vue'
import ProfessorProfileHeader from '@/components/Profile/professor/ProfileHeader.vue'
import ProfessorProfileInformation from '@/components/Profile/professor/ProfileProfessorInformation.vue'
import ProfileProfessorTabs from '@/components/Profile/ProfileProfessorTabs.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const userId = computed(() => route.params.id as string | undefined)

const { profile, isOwner, refresh, imageVersion, isLoading } = useProfessorProfile(userId.value)

const onUpdated = async () => {
  await refresh()
  imageVersion.value = Date.now()
}
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB]">
    <aside class="hidden lg:block w-72 h-screen sticky top-0 border-r border-slate-100 bg-white">
      <ProfileSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />
    </aside>

    <div
      v-if="sidebarOpen"
      class="lg:hidden fixed inset-0 z-50"
    >
      <div
        class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        @click="sidebarOpen = false"
      />
      <div class="absolute left-0 top-0 w-72 h-full bg-white shadow-xl">
        <ProfileSidebar
          :open="sidebarOpen"
          @close="sidebarOpen = false"
        />
      </div>
    </div>

    <main class="flex-1 mb-6">
      <ProfessorProfileHeader
        :profile="profile"
        :image-version="imageVersion"
        @open-sidebar="sidebarOpen = true"
      />

      <div
        v-if="isLoading"
        class="mx-4 md:mx-20 mt-6 bg-white p-6 rounded-xl animate-pulse"
      >
        Loading...
      </div>

      <div
        v-else
        class="mx-4 md:mx-20 bg-white shadow-2xl rounded-b-xl p-5"
      >
        <ProfessorProfileInformation
          :profile="profile"
          :is-owner="isOwner"
          @updated="onUpdated"
        />

        <ProfileProfessorTabs
          :user-id="profile?.profile.user._id"
          :readonly="!isOwner"
          :is-owner="isOwner"
        />
      </div>
    </main>
  </div>
</template>

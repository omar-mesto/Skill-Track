<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import ProfileHeader from '@@/components/Profile/ProfileHeader.vue'
import ProfileSidebar from '@@/components/layout/ProfileSidebar.vue'
import ProfileInformation from '@@/components/Profile/ProfileInformation.vue'
import ProfileTabs from '@@/components/Profile/ProfileTabs.vue'

import { useProfile } from '@@/composables/useProfile'

// ===============================
// Router & UI
// ===============================
const route = useRoute()
const sidebarOpen = ref(false)
const imageVersion = ref(Date.now())

// ===============================
// 1️⃣ بروفايل صاحب الصفحة (الطالب)
// ===============================
const viewedUserId = computed(() => route.params.id as string)

const {
  profile: viewedProfile,
  isOwner,
  refresh,
  isLoading,
} = useProfile(viewedUserId.value)

// ===============================
// 2️⃣ بروفايل المستخدم الحالي (أنت)
// ===============================
const {
  profile: myProfile,
} = useProfile() // بدون userId = المستخدم الحالي

// ===============================
// Helpers
// ===============================
const onProfileUpdated = async () => {
  await refresh()
  imageVersion.value = Date.now()
}
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB]">
    <!-- Sidebar -->
    <ProfileSidebar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <main class="flex-1 mb-6">
      <!-- Header -->
      <ProfileHeader
        :profile="viewedProfile"
        :image-version="imageVersion"
        @updated="onProfileUpdated"
      />

      <!-- Content -->
      <div class="mx-4 md:mx-20 bg-white shadow-2xl rounded-b-xl p-5">
        <!-- ===============================
             Profile Information
             هنا نمرّر المستخدم الحالي الصحيح
        =============================== -->
        <ProfileInformation
          v-if="viewedProfile && myProfile"
          :current-user="myProfile.user"
          :readonly="isOwner"
          @open-sidebar="sidebarOpen = true"
        />

        <!-- ===============================
             Tabs
        =============================== -->
        <ProfileTabs
          v-if="viewedProfile"
          :user-id="viewedProfile.user?._id"
          :readonly="isOwner"
          :is-owner="isOwner"
        />
      </div>
    </main>
  </div>
</template>

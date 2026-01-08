<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCompanyProfile } from '@@/composables/useCompanyProfile'

const route = useRoute()
const sidebarOpen = ref(false)

const {
  profile,
  isOwner,
  imageVersion,
  isLoading,
} = useCompanyProfile()
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB]">
    <main class="flex-1">
      <ProfileCompanyProfileHeader
        v-if="profile"
        :profile="profile"
        :image-version="imageVersion"
      />

      <div
        v-if="!isLoading && profile"
        class="mx-4 md:mx-20 bg-white shadow rounded-b-xl p-5"
      >
        <ProfileCompanyInformation :profile="profile" />

        <ProfileCompanyTabs
          :user-id="profile.profile.user._id"
          readonly
        />
      </div>
    </main>
  </div>
</template>

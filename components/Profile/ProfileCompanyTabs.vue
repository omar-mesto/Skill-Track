<script setup lang="ts">
import { computed, markRaw, shallowRef } from 'vue'

import CompanyTask from '../CompanyTask.vue'
import Posts from '@/components/Profile/tabs/Posts.vue'
import Followers from '@/components/Profile/tabs/Followers.vue'

const { profile } = useCompanyProfile()
const storage = useGlobalStore()

const currentUser = computed(() => ({
  _id: storage.id,
  role: storage.role,
}))

const tabs = [
  { name: 'Posts', component: markRaw(Posts) },
  { name: 'Tasks', component: markRaw(CompanyTask) },
  { name: 'Follow', component: markRaw(Followers) },
]

const activeTab = shallowRef(tabs[0])

const userId = computed(() => profile.value?.profile?.user?._id || null)

const isMyProfile = computed(() =>
  !!userId.value && currentUser.value._id === userId.value,
)

const canFollow = computed(() => !isMyProfile.value)

const canRender = computed(() => !!userId.value)
</script>

<template>
  <div class="flex gap-4 border-b pb-2 px-1 mt-6 overflow-x-auto whitespace-nowrap">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      :class="[
        'pb-2 font-semibold transition-all duration-300',
        activeTab.name === tab.name
          ? 'text-primary border-b-2 border-primary'
          : 'text-primary hover:text-Sequand hover:cursor-pointer',
      ]"
      @click="activeTab = tab"
    >
      {{ tab.name }}
    </button>
  </div>

  <div v-if="canRender">
    <component
      :is="activeTab.component"
      :key="`${activeTab.name}-${userId}`"
      :user-id="userId"
      :posts="profile?.posts || []"
      :is-owner="isMyProfile"
    />
  </div>

  <div v-else class="py-8 text-center text-gray-500">
    Loading...
  </div>
</template>

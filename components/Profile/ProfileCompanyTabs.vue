<script setup lang="ts">
import { ref } from 'vue'

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
  { name: 'Posts', component: Posts },
  { name: 'Tasks', component: CompanyTask },
  { name: 'Follow', component: Followers },
]

const isMyProfile = computed(() =>
  currentUser.value._id === profile.value?.profile.user._id,
)

const canFollow = computed(() =>
  !isMyProfile.value,
)

const userId = computed(() => profile.value?.profile?.user?._id)
const activeTab = ref(tabs[0])
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

  <component
    :is="activeTab.component"
    v-if="userId"
    :user-id="profile?.profile?.user?._id"
  />
</template>

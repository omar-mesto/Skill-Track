<script setup lang="ts">
import { ref, markRaw } from 'vue'

import Portfolio from '@/components/Profile/tabs/Portfolio.vue'
import Posts from '@/components/Profile/tabs/Posts.vue'
import Tasks from '@/components/Profile/tabs/Tasks.vue'
import Followers from '@/components/Profile/tabs/Followers.vue'
import Question from '@/components/Profile/tabs/Question.vue'

const { profile, isOwner } = useProfile()

const tabs = [
  { name: 'Profile', component: markRaw(Portfolio) },
  { name: 'Posts', component: markRaw(Posts) },
  { name: 'Question', component: markRaw(Question) },
  { name: 'Tasks', component: markRaw(Tasks) },
  { name: 'Follow', component: markRaw(Followers) },
]

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
    :user-id="profile?.user?._id"
    :is-owner="isOwner"
  />
</template>

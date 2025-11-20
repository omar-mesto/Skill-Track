<script setup lang="ts">
import { ref } from 'vue'

import Portfolio from '@/components/Profile/tabs/Portfolio.vue'
import Posts from '@/components/Profile/tabs/Posts.vue'
import Tasks from '@/components/Profile/tabs/Tasks.vue'
import Followers from '@/components/Profile/tabs/Followers.vue'

const tabs = [
  { name: 'Profile', component: Portfolio },
  { name: 'Posts', component: Posts },
  { name: 'Tasks', component: Tasks },
  { name: 'Follow', component: Followers },
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

  <div
    name="fade"
    mode="out-in"
  >
    <component :is="activeTab.component" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

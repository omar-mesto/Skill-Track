<script setup lang="ts">
import { ref } from 'vue'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import QuestionsList from '~/components/Profile/tabs/QuestionsList.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex">
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
    </div>

    <main class="flex-1 h-screen overflow-y-auto custom-scrollbar">
      <header class="lg:hidden p-4 flex items-center bg-white border-b border-slate-100 sticky top-0 z-30">
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
        <span class="ml-4 font-bold text-slate-900 text-lg">My Questions</span>
      </header>

      <div class="p-4 md:p-8">
        <QuestionsList />
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>

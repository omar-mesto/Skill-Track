<script setup lang="ts">
import { useGetAllTasks } from '@@/queries/tasks'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import TaskCard from '~/components/Tasks/TaskCard.vue'

const { data } = useGetAllTasks()
const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-w-full min-h-screen bg-[#f8fafc]">
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
    <div class="bg-background mx-auto w-full">
      <div class="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-4">
        <TaskCard
          v-for="t in data?.data"
          :key="t._id"
          :task="t"
          link
          role="student"
        >
          <UButton
            class="mt-6 bg-primary"
            :to="`/tasks/${t._id}/solve`"
            block
          >
            Solve Task
          </UButton>
        </TaskCard>
      </div>
    </div>
  </div>
</template>

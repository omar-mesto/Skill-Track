<script setup lang="ts">
import { useGetAllTasks } from '@@/queries/tasks'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import TaskCard from '~/components/Tasks/TaskCard.vue'

const { data } = useGetAllTasks()
const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-w-full min-h-screen bg-[#f8fafc]">
    <aside class="sticky top-0 hidden h-screen bg-white border-r lg:block border-slate-100 min-w-[260px]">
      <ProfileSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />
    </aside>
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

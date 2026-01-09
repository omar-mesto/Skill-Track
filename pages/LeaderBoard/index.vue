<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useGetStudentsLeaderboard } from '@@/queries/LeaderBoard/student'
import type { StudentLeaderboardItem } from '~/models/studentLeaderboard'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'

const sidebarOpen = ref(false)
const students = ref<StudentLeaderboardItem[]>([])
const isInitialLoading = ref(true)

const { data, status, refresh } = await useGetStudentsLeaderboard()

watch(
  status,
  (newStatus) => {
    if (newStatus === 'success' && data.value) {
      students.value = data.value.data
      isInitialLoading.value = false
    } else if (newStatus === 'error') {
      isInitialLoading.value = false
    }
  },
  { immediate: true },
)

onMounted(async () => {
  if (status.value === 'idle' || !data.value) {
    await refresh()
  }
})

const showSkeleton = computed(() => status.value === 'pending' || isInitialLoading.value)
const showNoData = computed(() => !showSkeleton.value && students.value.length === 0)
</script>

<template>
  <div class="flex min-h-screen bg-[#f8fafc]">
    <aside class="sticky top-0 hidden h-screen bg-white border-r lg:block border-slate-100 min-w-[260px]">
      <ProfileSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />
    </aside>

    <main class="flex-1 h-screen overflow-y-auto custom-scrollbar">
      <header class="sticky top-0 z-30 flex items-center p-4 bg-white border-b lg:hidden border-slate-100">
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
        <span class="ml-3 font-bold text-slate-900">Leaderboard</span>
      </header>
      <div class="px-8 mt-6">
        <h1 class="text-2xl font-bold text-slate-900">
          Students Leaderboard
        </h1>
        <p class="text-sm text-slate-500">
          Top students ranked by total points earned
        </p>
      </div>

      <div class="p-4 md:p-8">
        <div class="flex flex-col gap-3">
          <template v-if="showSkeleton">
            <div
              v-for="i in 5"
              :key="i"
              class="flex items-center gap-4 p-4 bg-white border animate-pulse rounded-xl border-slate-100"
            >
              <div class="w-12 h-12 bg-slate-200 rounded-full" />
              <div class="flex-1 space-y-2">
                <div class="h-4 rounded bg-slate-200 w-1/4" />
                <div class="h-3 rounded bg-slate-200 w-1/2" />
              </div>
            </div>
          </template>

          <template v-else-if="students.length > 0">
            <NuxtLink
              v-for="(item, index) in students"
              :key="item._id"
              :to="`/profile/student?id=${item.student._id}`"
              class="flex items-center justify-between p-4 transition-all bg-white border shadow-sm rounded-xl border-slate-100 hover:border-primary/30 cursor-pointer"
            >
              <div class="flex items-center flex-1 gap-4 min-w-0">
                <span class="w-8 text-lg font-black text-slate-300">
                  #{{ index + 1 }}
                </span>

                <UUser
                  :name="item.student.email"
                  :avatar="{
                    src: item.student.avatar
                      ? 'http://localhost:5000/' + item.student.avatar
                      : '/StudentLogin.png',
                  }"
                  size="xl"
                  :ui="{ name: 'text-black font-bold' }"
                >
                  <template #description>
                    <span class="text-xs text-slate-400 font-medium">
                      Student
                    </span>
                  </template>
                </UUser>
              </div>

              <div class="text-right shrink-0">
                <p class="text-xl font-black text-primary">
                  {{ item.totalPoints }}
                </p>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  Points
                </p>
              </div>
            </NuxtLink>
          </template>

          <div
            v-else-if="showNoData"
            class="flex flex-col items-center justify-center py-20 bg-white border border-dashed rounded-2xl border-slate-200 text-slate-400"
          >
            <UIcon
              name="i-heroicons-circle-stack"
              class="w-12 h-12 mb-3 opacity-20"
            />
            <p class="font-medium">
              No leaderboard data available.
            </p>
          </div>
        </div>
      </div>
    </main>

    <USlideover
      v-model="sidebarOpen"
      side="left"
      class="lg:hidden"
    >
      <div class="flex-1 h-full p-4 overflow-y-auto bg-white">
        <ProfileSidebar
          :open="sidebarOpen"
          @close="sidebarOpen = false"
        />
      </div>
    </USlideover>
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

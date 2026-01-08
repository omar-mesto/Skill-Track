<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { LeaderboardItem } from '@@/models/professorLeaderboard'
import { useGetProfessorsLeaderboard } from '@@/queries/LeaderBoard/professor'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'

const sidebarOpen = ref(false)
const professors = ref<LeaderboardItem[]>([])
const isInitialLoading = ref(true)

const { data, status, refresh } = await useGetProfessorsLeaderboard()

watch(status, (newStatus) => {
  if (newStatus === 'success' && data.value) {
    professors.value = data.value.data
    isInitialLoading.value = false
  } else if (newStatus === 'error') {
    isInitialLoading.value = false
  }
}, { immediate: true })

onMounted(async () => {
  if (status.value === 'idle' || !data.value) {
    await refresh()
  }
})

const showSkeleton = computed(() => status.value === 'pending' || isInitialLoading.value)
const showNoData = computed(() => !showSkeleton.value && professors.value.length === 0)
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
          Professors Leaderboard
        </h1>
        <p class="text-sm text-slate-500">
          Top performing professors based on evaluations
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

          <template v-else-if="professors.length > 0">
            <NuxtLink
              v-for="(item, index) in professors"
              :key="item._id"
              :to="`../profile/professor?id=${item.professor._id}`"
              class="flex items-center justify-between p-4 transition-all bg-white border shadow-sm rounded-xl border-slate-100 hover:border-primary/30 cursor-pointer"
            >
              <div class="flex items-center flex-1 gap-4 min-w-0">
                <span class="w-8 text-lg font-black text-slate-300">#{{ index + 1 }}</span>
                <UUser
                  :name="item.professor.name"
                  :avatar="{
                    src: item.professor.avatar ? 'http://localhost:5000/' + item.professor.avatar : '/StudentLogin.png',
                  }"
                  size="xl"
                  :ui="{ name: 'text-black font-bold' }"
                >
                  <template #description>
                    <div class="flex flex-col gap-1 mt-1">
                      <div class="flex items-center gap-2">
                        <span class="text-[12px] text-slate-400 font-medium">{{ item.evaluationsCount }} Evaluations</span>
                        <span class="text-[12px] text-slate-400 font-medium">{{ item.postsCount }} Posts</span>
                        <span class="text-[12px] text-slate-400 font-medium">{{ item.commentsCount }} Comments</span>
                      </div>
                    </div>
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

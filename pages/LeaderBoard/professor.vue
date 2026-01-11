<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { LeaderboardItem } from '@@/models/professorLeaderboard'
import { useGetProfessorsLeaderboard } from '@@/queries/LeaderBoard/professor'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import MobileBackButton from '~/components/common/MobileBackButton.vue'

const sidebarOpen = ref(false)
const professors = ref<LeaderboardItem[]>([])
const isInitialLoading = ref(true)

const { data, status, refresh } = await useGetProfessorsLeaderboard()

watch(
  status,
  (newStatus) => {
    if (newStatus === 'success' && data.value) {
      professors.value = data.value.data
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
const showNoData = computed(() => !showSkeleton.value && professors.value.length === 0)
</script>

<template>
  <div class="flex min-h-screen bg-[#f8fafc]">
    <aside class="hidden lg:block w-[260px] h-screen sticky top-0 bg-white border-r border-slate-100">
      <ProfileSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />
    </aside>

    <USlideover
      v-model="sidebarOpen"
      side="left"
      class="lg:hidden"
    >
      <div class="h-full p-4 bg-white">
        <ProfileSidebar
          :open="sidebarOpen"
          @close="sidebarOpen = false"
        />
      </div>
    </USlideover>

    <main class="flex-1 h-screen overflow-y-auto">
      <header class="sticky top-0 z-30 flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-100 lg:hidden">
        <MobileBackButton />
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
        <span class="font-bold text-slate-900">Leaderboard</span>
      </header>

      <div class="px-4 mt-4">
        <h1 class="text-2xl font-bold text-slate-900 leading-tight">
          Professors Leaderboard
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Top performing professors based on evaluations
        </p>
      </div>

      <div class="p-4 space-y-3">
        <template v-if="showSkeleton">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center gap-3 p-4 bg-white border rounded-2xl animate-pulse"
          >
            <div class="w-10 h-10 bg-slate-200 rounded-full" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-200 rounded w-1/2" />
              <div class="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </template>

        <template v-else-if="professors.length">
          <NuxtLink
            v-for="(item, index) in professors"
            :key="item._id"
            :to="`/profile/professor/${item.professor._id}`"
            class="flex items-center gap-3 w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-[0.98] transition"
          >
            <span class="text-sm font-bold text-slate-400 w-6 shrink-0">
              #{{ index + 1 }}
            </span>
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <UAvatar
                :src="item.professor.avatar
                  ? 'https://skill-track-gr0b.onrender.com/' + item.professor.avatar
                  : '/StudentLogin.png'"
                size="md"
              />

              <div class="min-w-0">
                <p class="font-semibold text-slate-900 truncate">
                  {{ item.professor.name }}
                </p>

                <div class="flex flex-wrap gap-x-3 text-xs text-slate-400 mt-1">
                  <span>{{ item.evaluationsCount }} evals</span>
                  <span>{{ item.postsCount }} posts</span>
                  <span>{{ item.commentsCount }} comments</span>
                </div>
              </div>
            </div>

            <div class="text-right shrink-0">
              <p class="text-lg font-black text-primary leading-none">
                {{ item.totalPoints }}
              </p>
              <p class="text-[10px] text-slate-400 uppercase">
                pts
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
            No leaderboard data available
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>

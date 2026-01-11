<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { RecommendedUser } from '@@/models/recommendationModel'
import { useGetRecommendations } from '@@/queries/Profile/recommendations'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import UserFollowCard from '~/components/UserFollowCard.vue'
import UserFollowSkeleton from '~/components/UserFollowSkeleton.vue'

const storage = useGlobalStore()
const userId = storage.id

const sidebarOpen = ref(false)

const page = ref(1)
const limit = 10
const users = ref<RecommendedUser[]>([])
const hasMore = ref(true)
const isLoadingMore = ref(false)

const loadMoreRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

const fetchPage = async () => {
  if (!hasMore.value || isLoadingMore.value) return

  isLoadingMore.value = true

  const { data } = await useGetRecommendations(userId, page.value, limit)

  if (!data.value) {
    isLoadingMore.value = false

return
  }

  const newUsers = data.value.data.data
  const pagination = data.value.data.pagination

  const existingIds = new Set(users.value.map(u => u._id))
  const filtered = newUsers.filter(u => !existingIds.has(u._id))

  users.value.push(...filtered)

  if (pagination.page >= pagination.totalPages) {
    hasMore.value = false
  }

  isLoadingMore.value = false
}

watch(page, () => {
  fetchPage()
})

onMounted(() => {
  fetchPage()

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoadingMore.value) {
        page.value++
      }
    },
    {
      root: scrollContainerRef.value,
      threshold: 0.1,
    },
  )

  if (loadMoreRef.value) observer.observe(loadMoreRef.value)
})
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
      <div class="absolute left-0 top-0 w-72 h-full bg-white shadow-xl">
        <ProfileSidebar
          :open="sidebarOpen"
          @close="sidebarOpen = false"
        />
      </div>
    </div>
    <main
      ref="scrollContainerRef"
      class="flex-1 h-screen overflow-y-auto custom-scrollbar"
    >
      <p class="px-8 mt-5 font-bold text-slate-900 text-2xl">
        Recommended for you
      </p>
      <header class="lg:hidden p-4 flex items-center bg-white border-b border-slate-100 sticky top-0 z-30">
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
      </header>

      <div class="p-4 md:p-8 space-y-4">
        <div class="flex flex-col gap-3">
          <UserFollowCard
            v-for="u in users"
            :key="u._id"
            :user="u"
          />

          <template v-if="isLoadingMore">
            <UserFollowSkeleton
              v-for="i in 5"
              :key="i"
            />
          </template>

          <div
            ref="loadMoreRef"
            class="h-10"
          />
        </div>
      </div>
    </main>
  </div>
</template>

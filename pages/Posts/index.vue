<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGetPosts } from '@@/queries/posts'
import ReactionBar from '~/components/Questions/ReactionBar.vue'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'

const sidebarOpen = ref(false)

const page = ref(1)
const limit = ref(10)

const { data, status, refresh } = useGetPosts(page.value, limit.value)
const isLoading = computed(() => status.value === 'pending')

const posts = computed(() => data.value?.data.data ?? [])
const pagination = computed(() => data.value?.data.pagination ?? null)

const router = useRouter()
const goDetail = (id: string) => router.push(`/Posts/${id}`)

const handlePageChange = (p: number) => {
  page.value = p
  refresh()
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex">
    <aside class="hidden lg:block w-72 h-screen sticky top-0 border-r border-slate-100 bg-white">
      <ProfileSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />
    </aside>

    <main class="flex-1 overflow-y-auto">
      <header class="lg:hidden p-4 flex items-center bg-white border-b sticky top-0 z-30">
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
      </header>
      <p class="m-4 text-primary font-bold text-2xl">
        Posts
      </p>
      <div class="max-w-2xl mx-auto px-4 py-2 space-y-2">
        <div
          v-if="isLoading"
          class="space-y-6"
        >
          <USkeleton
            v-for="i in 3"
            :key="i"
            class="h-64 w-full rounded-xl"
          />
        </div>

        <div
          v-else
          class="space-y-8"
        >
          <div
            v-for="p in posts"
            :key="p._id"
            class="bg-white border rounded-2xl shadow-sm overflow-hidden"
          >
            <div class="flex items-center gap-3 m-2">
              <UAvatar
                :src="p.authorId?.avatar ? `http://localhost:5000/${p.authorId.avatar}` : '/StudentLogin.png'"
                size="md"
              />
              <div>
                <p class="font-semibold text-gray-900">
                  {{ p.authorId?.email }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ new Date(p.createdAt).toLocaleDateString() }}
                </p>
              </div>
            </div>

            <div
              v-if="p.imageUrl"
              class="w-full h-64 overflow-hidden cursor-pointer"
              @click="goDetail(p._id)"
            >
              <img
                :src="`http://localhost:5000/${p.imageUrl}`"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              >
            </div>

            <div class="p-4 space-y-3">
              <h3
                class="font-bold text-lg  text-black cursor-pointer hover:underline"
                @click="goDetail(p._id)"
              >
                {{ p.title }}
              </h3>

              <p class="text-gray-700 text-sm line-clamp-3">
                {{ p.content }}
              </p>

              <div class="flex justify-between items-center pt-3 border-t">
                <ReactionBar
                  target-type="question"
                  :target-id="p._id"
                  :reactions="p.reactions"
                  :my-reaction="p.myReaction"
                />

                <UButton
                  icon="i-heroicons-chat-bubble-left"
                  variant="ghost"
                  color="info"
                  @click="goDetail(p._id)"
                >
                  {{ p.counters.comments }}
                </UButton>
              </div>
            </div>
          </div>

          <div
            v-if="pagination && pagination.totalPages > 1"
            class="flex justify-center pt-6"
          >
            <UPagination
              v-model="page"
              :page-count="limit"
              :total="pagination.total"
              @update:model-value="handlePageChange"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

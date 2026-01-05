<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetQuestions, useDeleteQuestion } from '@@/queries/questions/index'
import ReactionBar from '~/components/Questions/ReactionBar.vue'

const page = ref(1)
const limit = ref(12)
const router = useRouter()

const loadMoreRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && page.value < pagination.value.totalPages) {
        page.value++
        refresh()
      }
    },
    { threshold: 1 },
  )

  if (loadMoreRef.value) observer.observe(loadMoreRef.value)
})

const { data, refresh, status } = useGetQuestions(page.value, limit.value)
const isLoading = computed(() => status.value === 'pending')
const questions = computed(() => data.value?.data.data ?? [])
const pagination = computed(() => data.value?.data.pagination ?? null)

const goDetail = (id: string) => router.push(`/questions/${id}`)
const getImg = (path: string) => path ? `http://localhost:5000${path}` : null

function goToProfile(user: any) {
  if (!user) return
  const userId = typeof user === 'string' ? user : user._id
  const role = user.role || 'student'

  if (role === 'student') {
    router.push(`/profile/student/${userId}`)
  } else if (role === 'professor') {
    router.push(`/profile/professor?id=${userId}`)
  } else if (role === 'company') {
    router.push(`/profile/company?id=${userId}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">
      <div
        v-if="isLoading"
        class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-64 bg-white animate-pulse border border-slate-100"
        />
      </div>

      <div
        v-else
        class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <div
          v-for="q in questions"
          :key="q._id"
          class="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div
            v-if="q.imageUrl"
            class="relative overflow-hidden cursor-pointer"
            @click="goDetail(q._id)"
          >
            <img
              :src="getImg(q.imageUrl)"
              class="w-full max-h-72 object-cover transition-transform duration-700 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <span class="text-white text-xs bg-white/20 px-3 py-1 rounded-full">View</span>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div
              class="flex items-center gap-3 cursor-pointer"
              @click="goToProfile(q.authorId)"
            >
              <UAvatar
                :src="getImg(q.authorId?.avatar)"
                size="md"
              />
              <div>
                <p class="font-bold text-slate-900">
                  {{ q.authorId?.name }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ q.authorRole }}
                </p>
              </div>
            </div>

            <h3
              class="text-lg font-extrabold text-slate-900 group-hover:text-primary transition cursor-pointer"
              @click="goDetail(q._id)"
            >
              {{ q.title }}
            </h3>

            <p class="text-sm text-slate-600 line-clamp-2">
              {{ q.content }}
            </p>

            <div class="pt-4 border-t flex justify-between items-center">
              <ReactionBar
                target-type="question"
                :target-id="q._id"
              />
              <span class="text-xs text-slate-400">{{ q.counters?.comments }} comments</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref="loadMoreRef"
        class="h-10"
      />
    </div>
  </div>
</template>

<style scoped>
.columns-1 { column-count: 1; }
@media (min-width: 768px) { .columns-2 { column-count: 2; } }
@media (min-width: 1024px) { .columns-3 { column-count: 3; } }
.break-inside-avoid { break-inside: avoid; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

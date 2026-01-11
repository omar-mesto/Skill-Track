<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@@/stores/global'
import { useGetQuestionDetail, useDeleteQuestion, useGetReactionsList } from '@@/queries/questions'
import ReactionBar from '@@/components/Questions/ReactionBar.vue'
import CommentsTree from '~/components/Questions/CommentsTree.vue'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import type { ReactionType } from '~/models/questionModel'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()

const sidebarOpen = ref(false)
const showDeleteConfirm = ref(false)

const id = computed(() => route.params.id as string)
const questionId = id.value
const reactions = ref<Partial<Record<ReactionType, number>>>({})
const myReaction = ref<ReactionType | null>(null)
const { data, refresh, status } = useGetQuestionDetail(questionId)
const isLoading = computed(() => status.value === 'pending')

const q = computed(() => data.value?.data.question ?? null)
const comments = computed(() => data.value?.data.comments ?? [])

const canMarkSolution = computed(() => {
  if (!q.value) return false
  const isOwner = q.value.authorId?._id === store.id
  const isProfessor = store.role === 'professor'

  return isOwner || isProfessor
})

const fetchReactions = async () => {
  const { data, execute } = useGetReactionsList('question', questionId)

  await execute()

  const list = data.value?.data || []

  const counts: Partial<Record<ReactionType, number>> = {}
  let mine: ReactionType | null = null

  list.forEach((r) => {
    counts[r.type] = (counts[r.type] || 0) + 1

    if (
      typeof r.userId === 'object' &&
      r.userId?._id === store.id
    ) {
      mine = r.type
    }
  })

  reactions.value = counts
  myReaction.value = mine
}

onMounted(fetchReactions)

const confirmDelete = async () => {
  if (!q.value) return
  const { execute, status } = useDeleteQuestion(q.value._id)
  await execute()
  if (status.value === 'success') {
    showDeleteConfirm.value = false
    router.push('/profile/student')
  }
}

const BASE_URL = 'https://skill-track-gr0b.onrender.com'
const resolveImage = (path?: string | undefined) =>
  path ? new URL(path, BASE_URL).href : null
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

    <main class="flex-1 overflow-y-auto">
      <header class="lg:hidden p-4 flex items-center bg-white border-b border-slate-100 sticky top-0 z-30">
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
        <span class="ml-4 font-bold text-slate-900 text-lg">
          Question Details
        </span>
      </header>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div
          v-if="isLoading"
          class="space-y-4"
        >
          <USkeleton class="h-12 w-3/4 rounded-lg" />
          <div class="flex gap-4">
            <USkeleton class="h-10 w-10 rounded-full" />
            <USkeleton class="h-10 w-32 rounded-lg" />
          </div>
          <USkeleton class="h-64 w-full rounded-xl" />
        </div>

        <article
          v-else-if="q"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-50 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="q.authorId?.avatar ? `https://skill-track-gr0b.onrender.com/${q.authorId.avatar}` : '/StudentLogin.png'"
                size="lg"
              />
              <div>
                <p class="font-bold text-gray-900">
                  {{ q.authorId?.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ q.authorId?.email }} • {{ new Date(q.createdAt).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <h1 class="text-3xl font-extrabold text-gray-900 mb-4">
              {{ q.title }}
            </h1>

            <div class="prose max-w-none text-gray-700 mb-6">
              {{ q.content }}
            </div>

            <img
              v-if="q.imageUrl"
              :src="resolveImage(q.imageUrl)"
              class="w-full rounded-xl border bg-gray-50 mb-6"
            >

            <div class="flex items-center gap-6 py-4 border-t">
              <ReactionBar
                target-type="question"
                :target-id="questionId"
                :reactions="reactions"
                :my-reaction="myReaction"
              />

              <span class="text-sm text-gray-500">
                {{ comments.length }} Comments
              </span>
            </div>
          </div>

          <div class="bg-gray-50 p-6 border-t">
            <CommentsTree
              :target-id="q._id"
              target-type="question"
              :comments="comments"
              :can-mark-solution="canMarkSolution"
              :solution-comment-id="q.solutionCommentId"
              @refresh="refresh()"
            />
          </div>
        </article>

        <div
          v-else
          class="text-center py-20"
        >
          <p class="text-gray-500 text-xl">
            Question not found
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.prose {
  white-space: pre-line;
}
</style>

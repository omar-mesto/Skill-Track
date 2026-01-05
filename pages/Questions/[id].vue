<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetQuestionDetail, useDeleteQuestion } from '@@/queries/questions/index'
import CommentsTree from '~/components/Questions/CommentsTree.vue'
import ReactionBar from '~/components/Questions/ReactionBar.vue'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data, refresh, status } = useGetQuestionDetail(id.value)
const isLoading = computed(() => status.value === 'pending')

const q = computed(() => data.value?.data.question ?? null)
const comments = computed(() => data.value?.data.comments ?? [])

const store = useGlobalStore()

const canMarkSolution = computed(() => {
  if (!q.value) return false
  const isOwner = q.value.authorId?._id === store.id
  const isProfessor = store.role === 'professor'

return isOwner || isProfessor
})

const deleteQuestion = async () => {
  if (!q.value) return
  if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
    const { execute } = useDeleteQuestion(q.value._id)
    await execute()
    useRouter().push('/profile/student')
  }
}
const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <aside class="hidden lg:block w-72 h-screen sticky top-0 border-r border-slate-100 bg-white">
      <ProfileSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />
    </aside>
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
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
              :src="q.authorId?.avatar ? `http://localhost:5000/${q.authorId.avatar}` : '/StudentLogin.png'"
              size="lg"
              class="ring-2 ring-primary/10"
            />
            <div>
              <p class="font-bold text-gray-900">
                {{ q.authorId?.name }}
              </p>
              <p class="text-xs text-gray-500 uppercase tracking-wider">
                {{ q.authorRole }} • {{ new Date(q.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <UDropdown
            v-if="q.authorId?._id === store.id || store.role === 'admin'"
            :items="[[{ label: 'Delete Question', icon: 'i-heroicons-trash', color: 'red', click: deleteQuestion }]]"
          >
            <UButton
              color="info"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal"
            />
          </UDropdown>
        </div>

        <div class="p-6">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">
              {{ q.title }}
            </h1>
            <UBadge
              v-if="q.isSolved"
              color="success"
              variant="subtle"
              size="md"
              class="rounded-full shrink-0"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-check-badge"
                  class="w-4 h-4"
                />
              </template>
              Solved
            </UBadge>
          </div>

          <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed text-lg mb-6">
            {{ q.content }}
          </div>

          <div
            v-if="q.imageUrl"
            class="relative group rounded-2xl overflow-hidden border border-gray-100 mb-6"
          >
            <img
              :src="`http://localhost:5000${q.imageUrl}`"
              class="w-full h-auto max-h-[500px] object-contain bg-gray-50 transition-transform duration-500 group-hover:scale-[1.01]"
            >
          </div>

          <div class="flex items-center gap-6 py-4 border-t border-gray-50">
            <ReactionBar
              target-type="question"
              :target-id="q._id"
            />
            <div class="flex items-center gap-1.5 text-gray-500">
              <UIcon
                name="i-heroicons-chat-bubble-left-right"
                class="w-5 h-5"
              />
              <span class="text-sm font-medium">{{ comments.length }} Comments</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50/50 p-6 border-t border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Discussion
          </h2>
          <CommentsTree
            :question-id="q._id"
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
        <UIcon
          name="i-heroicons-exclamation-circle"
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
        />
        <p class="text-gray-500 text-xl">
          Question not found.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  white-space: pre-line;
}
</style>

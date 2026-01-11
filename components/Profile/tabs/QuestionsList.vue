<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDeleteQuestion, useGetQuestions } from '@@/queries/questions'
import { useGlobalStore } from '@@/stores/global'
import ReactionBar from '~/components/Questions/ReactionBar.vue'

const store = useGlobalStore()

const page = ref(1)
const limit = ref(10)

const { data, refresh, status } = useGetQuestions(page.value, limit.value)
const isLoading = computed(() => status.value === 'pending')

const goProfile = (user: any) => {
  if (!user?._id || !user?.role) return

  router.push(`/profile/${user.role}/${user._id}`)
}

const questions = computed(() => data.value?.data.data ?? [])

const router = useRouter()
const goDetail = (id: string) => router.push(`/questions/${id}`)

const showDeleteConfirm = ref(false)
const selectedQuestionId = ref<string | null>(null)

const openDeleteModal = (id: string) => {
  selectedQuestionId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!selectedQuestionId.value) return

  const { execute, status } = useDeleteQuestion(selectedQuestionId.value)
  await execute()

  if (status.value === 'success') {
    showDeleteConfirm.value = false
    selectedQuestionId.value = null
    refresh()
  }
}

const BASE_URL = 'https://skill-track-gr0b.onrender.com'
const resolveImage = (path?: string) =>
  path ? new URL(path, BASE_URL).href : null
</script>

<template>
  <div class="space-y-8">
    <div
      v-for="q in questions"
      :key="q._id"
      class="bg-white max-w-3xl mx-auto border rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="p-4 flex justify-between items-center">
        <div
          class="flex items-center gap-3 cursor-pointer"
          @click="goProfile(q.authorId)"
        >
          <UAvatar
            :src="q.authorId?.avatar
              ? `https://skill-track-gr0b.onrender.com/${q.authorId.avatar}`
              : '/StudentLogin.png'"
            size="md"
          />
          <div>
            <p class="font-semibold text-gray-900">
              {{ q.authorId?.email }}
            </p>
            <p class="text-xs text-gray-500">
              {{ new Date(q.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <UButton
          v-if="q.authorId?._id === store.id"
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          class="rounded-full"
          @click="openDeleteModal(q._id)"
        />
      </div>

      <div
        v-if="q.imageUrl"
        class="w-full h-64 bg-gray-100 cursor-pointer overflow-hidden"
        @click="goDetail(q._id)"
      >
        <img
          :src="resolveImage(q.imageUrl)"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        >
      </div>

      <div class="p-4 space-y-3">
        <h3
          class="font-bold text-lg text-gray-900 cursor-pointer hover:underline"
          @click="goDetail(q._id)"
        >
          {{ q.title }}
        </h3>

        <div class="flex w-full justify-between">
          <p class="text-gray-700 text-sm line-clamp-3">
            {{ q.content }}
          </p>

          <p class="text-green-500 text-sm line-clamp-3">
            {{ q.isSolved ? 'Solved' : '' }}
          </p>
        </div>

        <div class="flex justify-between items-center pt-3 border-t">
          <ReactionBar
            target-type="question"
            :target-id="q._id"
            :reactions="q.reactions"
            :my-reaction="q.myReaction"
          />

          <UButton
            icon="i-heroicons-chat-bubble-left"
            variant="ghost"
            color="info"
            @click="goDetail(q._id)"
          >
            {{ q.counters?.comments || 0 }}
          </UButton>
        </div>
      </div>
    </div>
    <UModal
      v-model:open="showDeleteConfirm"
      class="bg-white text-black"
      :ui="{ footer: 'justify-end' }"
    >
      <template #title>
        <p class="font-semibold text-black">
          Delete Question
        </p>
      </template>

      <template #body>
        <p>Are you sure you want to delete the question?</p>
      </template>

      <template #footer>
        <div class="flex gap-2">
          <UButton
            variant="ghost"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </UButton>

          <UButton
            class="bg-red-500 hover:bg-red-600 hover:text-white"
            @click="confirmDelete"
          >
            Delete
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

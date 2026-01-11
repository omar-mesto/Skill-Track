<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetMyQuestions, useDeleteQuestion } from '@@/queries/questions'
import { useGlobalStore } from '@@/stores/global'
import CreateQuestionModal from './CreateQuestionModal.vue'
import ReactionBar from '~/components/Questions/ReactionBar.vue'

const store = useGlobalStore()
const openCreate = ref(false)
const page = ref(1)
const limit = ref(10)

const { data, refresh, status } = useGetMyQuestions(page.value, limit.value)
const isLoading = computed(() => status.value === 'pending')

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
</script>

<template>
  <div class="space-y-8 my-2">
    <div class="flex justify-end">
      <UButton
        color="primary"
        icon="i-heroicons-plus-circle"
        class="rounded-full px-6"
        @click="openCreate = true"
      >
        Ask Question
      </UButton>
    </div>
    <div
      v-if="isLoading"
      class="space-y-8"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="bg-white border rounded-xl overflow-hidden shadow-sm"
      >
        <div class="p-4 flex items-center gap-3">
          <USkeleton
            class="h-10 w-10"
            :ui="{ rounded: 'rounded-full' }"
          />
          <USkeleton class="h-4 w-32" />
        </div>
        <USkeleton class="h-64 w-full" />
        <div class="p-4 space-y-2">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </div>
    </div>

    <div
      v-else
      class="space-y-8"
    >
      <div
        v-for="q in questions"
        :key="q._id"
        class="bg-white border max-w-xl mx-auto rounded-2xl shadow-sm overflow-hidden"
      >
        <div class="p-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="q.authorId?.avatar ? `http://localhost:5000/${q.authorId.avatar}` : '/StudentLogin.png'"
              size="md"
            />
            <div>
              <p class="font-semibold text-gray-900">
                {{ q.authorId?.name }}
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
            :src="`http://localhost:5000${q.imageUrl}`"
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

          <p class="text-gray-700 text-sm line-clamp-3">
            {{ q.content }}
          </p>

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
      <CreateQuestionModal
        v-model="openCreate"
        @created="refresh()"
      />
    </div>
  </div>
</template>

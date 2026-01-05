<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetMyQuestions, useDeleteQuestion } from '@@/queries/questions/index'
import CreateQuestionModal from './CreateQuestionModal.vue'
import ReactionBar from './ReactionBar.vue'

const openCreate = ref(false)
const page = ref(1)
const limit = ref(10)

const { data, refresh, status } = useGetMyQuestions(page.value, limit.value)
const isLoading = computed(() => status.value === 'pending')

const questions = computed(() => data.value?.data.data ?? [])
const pagination = computed(() => data.value?.data.pagination ?? null)

const router = useRouter()
const goDetail = (id: string) => router.push(`/questions/${id}`)

const deleteQuestion = async (id: string) => {
  if (confirm('Are you sure you want to delete this question?')) {
    const { execute } = useDeleteQuestion(id)
    await execute()
    refresh()
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  refresh()
}

const dropdownItems = computed(() => [[
  {
    label: 'Delete Question',
    icon: 'i-heroicons-trash',
    color: 'red',
    click: deleteQuestion,
  },
]])
</script>

<template>
  <div class="py-8 px-4">
    <div class="flex justify-between items-center mb-8 w-full">
      <h3 class="text-2xl font-extrabold text-gray-900 tracking-tight">
        Community Feed
      </h3>
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
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="q.authorId?.avatar ? `http://localhost:5000/${q.authorId.avatar}` : '/StudentLogin.png'"
              size="md"
              class="border"
            />
            <div>
              <p class="font-bold text-sm text-gray-900">
                {{ q.authorId?.name || 'User' }}
              </p>
              <p class="text-xs text-gray-500">
                {{ q.authorRole }} • {{ new Date(q.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <UDropdown
            :items="dropdownItems"
            @click.stop
          >
            <UButton
              color="info"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal"
            />
          </UDropdown>
        </div>

        <div
          v-if="q.imageUrl"
          class="aspect-square w-full h-50 mx-auto bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
          @click="goDetail(q._id)"
        >
          <img
            :src="`http://localhost:5000${q.imageUrl}`"
            class="w-full h-50 object-cover hover:scale-105 transition-transform duration-500"
            alt="Post content"
          >
        </div>

        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex justify-between gap-4 w-full">
              <ReactionBar
                target-type="question"
                :target-id="q._id"
              />
              <UButton
                icon="i-heroicons-chat-bubble-left"
                variant="ghost"
                color="info"
                @click="goDetail(q._id)"
              >
                <span class="text-sm font-medium">{{ q.counters?.comments || 0 }}</span>
              </UButton>
            </div>

            <div v-if="q.isSolved">
              <UBadge
                color="success"
                variant="soft"
                size="xs"
                class="rounded-full"
              >
                Solved
              </UBadge>
            </div>
          </div>

          <div class="space-y-1">
            <h4
              class="font-bold text-gray-900 cursor-pointer hover:underline"
              @click="goDetail(q._id)"
            >
              {{ q.title }}
            </h4>
            <p class="text-gray-700 text-sm line-clamp-3 leading-relaxed">
              {{ q.content }}
            </p>
          </div>

          <div
            v-if="q.tags?.length"
            class="flex flex-wrap gap-2 mt-4"
          >
            <span
              v-for="(t, i) in q.tags"
              :key="i"
              class="text-xs font-medium text-blue-600"
            >
              #{{ t }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="pagination && pagination.totalPages > 1"
        class="flex justify-center pt-8"
      >
        <UPagination
          v-model="page"
          :page-count="limit"
          :total="pagination.total"
          @update:model-value="handlePageChange"
        />
      </div>
    </div>

    <CreateQuestionModal
      v-model="openCreate"
      @created="refresh()"
    />
  </div>
</template>

<style scoped>
</style>

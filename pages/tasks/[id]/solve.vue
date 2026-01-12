<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlobalStore } from '@@/stores/global'
import { useRoute } from 'vue-router'
import { useGetTaskDetail, useSubmitTask, useGetMySubmissions } from '@@/queries/tasks'
import CodeEditor from '~/components/Tasks/CodeEditor.vue'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'

const route = useRoute()
const taskId = route.params.id as string

const code = ref('')
const showHintModal = ref(false)

const { data: taskData } = useGetTaskDetail(taskId)
const task = computed(() => taskData.value?.data ?? null)

const store = useGlobalStore()

const { data: submissionsData, refresh: refreshSubmissions } =
  useGetMySubmissions(store.id)

const submissions = computed(() =>
  (submissionsData.value?.data ?? []).filter(s => s.task._id === taskId),
)

const attemptsUsed = computed(() => submissions.value.length)
const maxAttempts = computed(() => task.value?.maxAttempts ?? 3)
const attemptsLeft = computed(() => maxAttempts.value - attemptsUsed.value)
const isSubmitDisabled = computed(() => attemptsLeft.value <= 0)
const lastSubmission = computed(() => submissions.value.at(-1) ?? null)

const isSubmitting = ref(false)

const submitSolution = async () => {
  if (isSubmitDisabled.value) return

  isSubmitting.value = true

  const { execute, status } = useSubmitTask(taskId, {
    codeAnswer: code.value,
    usedHints: !!lastSubmission.value?.usedHints,
  })

  await execute()

  if (status.value === 'success') {
    code.value = ''
    await refreshSubmissions()
  }

  isSubmitting.value = false
}

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white flex">
    <aside class="hidden lg:block w-72 border-r border-slate-100 bg-white">
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

    <main class="flex-1 px-4 sm:px-6 py-6">
      <div class="max-w-5xl mx-auto space-y-6">
        <div v-if="!task">
          <USkeleton class="h-64 w-full" />
        </div>

        <div v-else class="space-y-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {{ task.title }}
            </h1>
            <p class="text-slate-600 mt-2">
              {{ task.description }}
            </p>
          </div>

          <UCard
            v-if="lastSubmission"
            class="rounded-2xl border-green-200 bg-green-50"
          >
            <h3 class="font-bold text-slate-900">
              Last Result
            </h3>

            <p class="mt-1 text-sm text-slate-700">
              {{ lastSubmission.aiFeedback }}
            </p>

            <div class="flex flex-wrap gap-4 text-sm text-Sequand">
              <span>
                Score:
                <strong>{{ lastSubmission.finalPoints }}</strong>
              </span>
              <span>
                Similarity:
                <strong>{{ lastSubmission.similarityScore }}%</strong>
              </span>
            </div>
          </UCard>

          <UCard class="rounded-2xl">
            <CodeEditor
              v-model="code"
              :language="task.language"
            />

            <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-sm text-slate-600">
                Attempts left:
                <span class="font-bold">
                  {{ attemptsLeft }}
                </span>
                / {{ maxAttempts }}
              </div>

              <div class="flex flex-wrap gap-2">
                <UButton
                  color="info"
                  variant="outline"
                  class="rounded-full"
                  :disabled="!lastSubmission?.aiHint"
                  @click="showHintModal = true"
                >
                  Get AI Hint
                </UButton>

                <UButton
                  color="primary"
                  class="rounded-full"
                  :loading="isSubmitting"
                  :disabled="isSubmitDisabled"
                  @click="submitSolution"
                >
                  Submit Solution
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </main>

    <USlideover
      v-model:open="showHintModal"
      class="bg-white text-black"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #title>
        <h3 class="font-bold text-lg text-black">
          AI Hint
        </h3>
      </template>

      <template #body>
        <p class="text-slate-700 whitespace-pre-line">
          {{ lastSubmission?.aiHint }}
        </p>
      </template>

      <template #footer>
        <UButton
          color="primary"
          class="rounded-full"
          @click="showHintModal = false"
        >
          Got it
        </UButton>
      </template>
    </USlideover>
  </div>
</template>

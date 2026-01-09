<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetTaskSubmissions, useGetTaskDetail } from '@@/queries/tasks'

const route = useRoute()
const taskId = route.params.id as string

const { data: taskData } = useGetTaskDetail(taskId)
const task = computed(() => taskData.value?.data ?? null)

const { data, status } = useGetTaskSubmissions(taskId)
const isLoading = computed(() => status.value === 'pending')

const submissions = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <div v-if="task">
      <h1 class="text-3xl font-extrabold text-slate-900">
        {{ task.title }} – Submissions
      </h1>
    </div>

    <div v-if="isLoading">
      <USkeleton class="h-32 w-full" />
    </div>

    <div
      v-else-if="!submissions.length"
      class="text-slate-500 text-center py-12"
    >
      No submissions yet.
    </div>

    <div class="space-y-4">
      <UCard
        v-for="s in submissions"
        :key="s._id"
        class="rounded-2xl border-slate-200"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <p class="font-bold text-slate-900">
              {{ s.student.name }}
            </p>
            <p class="text-xs text-slate-500">
              {{ s.student.email }}
            </p>
          </div>

          <UBadge
            :color="s.isCorrect ? 'success' : 'error'"
            variant="soft"
            class="rounded-full"
          >
            {{ s.isCorrect ? 'Correct' : 'Wrong' }}
          </UBadge>
        </div>

        <div class="mt-3 text-sm text-slate-600">
          Attempt #{{ s.attemptNumber }}
        </div>

        <pre class="mt-3 bg-slate-900 text-slate-100 rounded-xl p-4 text-sm overflow-x-auto">
            {{ s.codeAnswer }}
        </pre>

        <div class="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <div>Score: <strong>{{ s.finalPoints }}</strong></div>
          <div>Similarity: <strong>{{ s.similarityScore }}%</strong></div>
          <div>AI Score: <strong>{{ s.aiScore }}</strong></div>
        </div>

        <div class="mt-3 text-sm text-slate-700">
          <strong>AI Feedback:</strong>
          <p class="mt-1">
            {{ s.aiFeedback }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

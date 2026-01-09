<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '@@/stores/global'
import { useGetMySubmissions } from '@@/queries/tasks'

const store = useGlobalStore()

const { data, status } = useGetMySubmissions(store.id)
const isLoading = computed(() => status.value === 'pending')

const submissions = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <h1 class="text-3xl font-extrabold text-slate-900">
      My Task Submissions
    </h1>

    <div v-if="isLoading">
      <USkeleton class="h-24 w-full" />
    </div>

    <div
      v-else-if="!submissions.length"
      class="text-center text-slate-500 py-12"
    >
      You haven’t submitted any solutions yet.
    </div>

    <div class="space-y-4">
      <UCard
        v-for="s in submissions"
        :key="s._id"
        class="rounded-2xl bg-background border-slate-200"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-slate-900">
              {{ s.task.title }}
            </h3>
            <p class="text-xs text-slate-500">
              Attempt #{{ s.attemptNumber }}
            </p>
            <p class="font-bold text-slate-500 my-3">
              {{ s.task.description }}
            </p>
          </div>

          <UBadge
            :color="s.isCorrect ? 'success' : 'error'"
            variant="soft"
            class="rounded-full"
          >
            {{ s.isCorrect ? 'Passed' : 'Failed' }}
          </UBadge>
        </div>

        <div class="mt-3 grid grid-cols-2 text-primary sm:grid-cols-4 gap-3 text-sm">
          <div>
            Score:
            <strong class="text-Sequand">{{ s.finalPoints }}</strong>
          </div>
          <div>
            Similarity:
            <strong class="text-Sequand">{{ s.similarityScore }}%</strong>
          </div>
          <div>
            Rank:
            <strong class="text-Sequand">{{ s.rank ?? '-' }}</strong>
          </div>
          <div>
            Status:
            <strong class="text-Sequand">{{ s.status }}</strong>
          </div>
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

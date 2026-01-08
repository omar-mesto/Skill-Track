<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEvaluationStore } from '@@/stores/evaluationStore'
import { useGlobalStore } from '@@/stores/global'
import { useGetProfessorEvaluation, useGetAIEvaluation } from '@@/queries/Evaluation/evaluate'
import type { ProfessorEvaluationItem } from '~/models/professorEvaluationModel'

const props = defineProps<{
  isOwner: boolean
  studentId?: string
}>()

const globalStore = useGlobalStore()
const evaluationStore = useEvaluationStore()
const toast = useToast()

const currentUserId = computed(() => globalStore.id)

const professorEvaluations = ref<ProfessorEvaluationItem[]>([])
const professorIndex = ref(0)

const loadingProfessor = ref(false)
const loadingAi = ref(false)

const showAiDetails = ref(false)

const REFRESH_INTERVAL_MINUTES = 10

const fetchProfessorEvaluations = async (id?: string) => {
  if (!id) return
  loadingProfessor.value = true
  try {
    const { data, status } = await useGetProfessorEvaluation(props.studentId)
    if (status.value === 'success' && data.value?.data) {
      professorEvaluations.value = data.value.data
      professorIndex.value = 0
    } else {
      professorEvaluations.value = []
    }
  } finally {
    loadingProfessor.value = false
  }
}

watch(() => props.studentId, (newId) => {
  if (newId) {
    fetchProfessorEvaluations(newId)
  }
}, { immediate: true })
onMounted(fetchProfessorEvaluations)

const selectedProfessorEvaluation = computed(() => {
  if (!professorEvaluations.value.length) return null

return professorEvaluations.value[professorIndex.value]
})

const canPrevProfessor = computed(() => professorIndex.value > 0)
const canNextProfessor = computed(() => professorIndex.value < professorEvaluations.value.length - 1)

const prevProfessor = () => {
  if (canPrevProfessor.value) professorIndex.value--
}

const nextProfessor = () => {
  if (canNextProfessor.value) professorIndex.value++
}

const hasValidAIEvaluation = computed(() => {
  if (!props.isOwner) return false
  if (!evaluationStore.aiEvaluation) return false

return evaluationStore.aiEvaluation.userId === currentUserId.value
})

const aiFitScore = computed(() => {
  if (!hasValidAIEvaluation.value) return null

return evaluationStore.aiEvaluation?.evaluation?.overall_score ?? null
})

const lastAiEvaluationTime = computed(() => {
  if (!hasValidAIEvaluation.value) return null

  return new Date(evaluationStore.aiEvaluation!.updatedAt)
})

const canRefreshAI = computed(() => {
  if (!lastAiEvaluationTime.value) return true
  const diff =
    (Date.now() - lastAiEvaluationTime.value.getTime()) / 1000 / 60

    return diff >= REFRESH_INTERVAL_MINUTES
})

const refreshRemainingMinutes = computed(() => {
  if (!lastAiEvaluationTime.value) return 0
  const diff =
    (Date.now() - lastAiEvaluationTime.value.getTime()) / 1000 / 60

    return Math.max(0, Math.ceil(REFRESH_INTERVAL_MINUTES - diff))
})

const getAiEvaluation = async () => {
  if (!props.isOwner) return

  loadingAi.value = true
  try {
    const { execute, data, status } = useGetAIEvaluation()
    await execute()

    if (status.value === 'success' && data.value?.data) {
      evaluationStore.setAIEvaluation(currentUserId.value, data.value.data)
      toast.add({
        description: 'AI evaluation updated successfully.',
        color: 'success',
        class: 'bg-white text-black',
      })
    }
  } catch {
    toast.add({
      description: 'Please update your profile and set your position before evaluation.',
      color: 'error',
      class: 'bg-white text-black',
    })
  } finally {
    loadingAi.value = false
  }
}
</script>

<template>
  <div class="bg-white shadow-xl rounded-xl p-5 w-full">
    <h3 class="text-lg font-bold text-gray-900 mb-4">
      Evaluation
    </h3>

    <div class="mb-8">
      <div class="flex justify-between items-center mb-3">
        <p class="text-sm font-semibold text-gray-700">
          Professor Evaluation
        </p>

        <div
          v-if="professorEvaluations.length > 1"
          class="flex gap-2"
        >
          <UButton
            size="xs"
            variant="ghost"
            :disabled="!canPrevProfessor"
            @click="prevProfessor"
          >
            Previous
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            :disabled="!canNextProfessor"
            @click="nextProfessor"
          >
            Next
          </UButton>
        </div>
      </div>

      <div
        v-if="loadingProfessor"
        class="p-4 bg-gray-50 rounded-xl animate-pulse"
      />

      <div
        v-else-if="selectedProfessorEvaluation"
        class="border rounded-xl p-4 bg-gray-50"
      >
        <UUser
          class="text-black"
          :name="selectedProfessorEvaluation.professor.name"
          :ui="{ name: 'text-black' }"
          :avatar="{
            src: selectedProfessorEvaluation.professor.avatar
              ? 'http://localhost:5000/' + selectedProfessorEvaluation.professor.avatar
              : '/StudentLogin.png',
          }"
          size="xl"
        >
          <template #description>
            <span class="text-gray-500">
              {{ selectedProfessorEvaluation.professor.email }}
            </span>
          </template>
        </UUser>

        <div class="mt-3 flex items-center gap-2">
          <UIcon
            name="i-heroicons-academic-cap"
            class="w-5 h-5 text-primary"
          />
          <span class="text-xl font-bold text-primary">
            {{ selectedProfessorEvaluation.totalScore }}
          </span>
          <span class="text-sm text-gray-500">/ 40</span>
        </div>

        <div class="mt-3 space-y-1">
          <div
            v-for="(value, key) in selectedProfessorEvaluation.competencies"
            :key="key"
            class="flex justify-between text-sm"
          >
            <span class="capitalize text-gray-600">{{ key }}</span>
            <span class="font-semibold text-primary">{{ value }}/10</span>
          </div>
        </div>

        <p class="mt-3 text-sm text-gray-700">
          {{ selectedProfessorEvaluation.overallComment }}
        </p>
      </div>

      <div
        v-else
        class="text-sm text-gray-500"
      >
        No professor evaluation yet.
      </div>
    </div>

    <div v-if="props.isOwner">
      <p class="text-sm font-semibold text-gray-700 mb-2">
        AI Evaluation
      </p>

      <div
        v-if="hasValidAIEvaluation"
        class="flex justify-between items-start"
      >
        <div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-cpu-chip"
              class="w-5 h-5 text-Sequand"
            />
            <span class="text-2xl font-bold text-Sequand">
              {{ aiFitScore }}%
            </span>
          </div>

          <p class="text-xs text-gray-500 mt-1">
            Last updated: {{ lastAiEvaluationTime?.toLocaleString() }}
          </p>
          <p
            v-if="!canRefreshAI"
            class="text-xs text-gray-500 w-full"
          >
            You can refresh in {{ refreshRemainingMinutes }} min
          </p>
        </div>

        <div class="flex flex-col items-end gap-1">
          <UButton
            size="xs"
            variant="ghost"
            @click="showAiDetails = true"
          >
            Details
          </UButton>

          <UButton
            size="xs"
            variant="ghost"
            class="pt-4"
            :loading="loadingAi"
            :disabled="!canRefreshAI"
            @click="getAiEvaluation"
          >
            Refresh
          </UButton>
        </div>
      </div>

      <UButton
        v-else
        size="sm"
        :loading="loadingAi"
        @click="getAiEvaluation"
      >
        Get evaluation now
      </UButton>
    </div>

    <UModal
      v-model:open="showAiDetails"
      class="bg-white text-black"
    >
      <template #title>
        <p class="text-black">
          AI Evaluation
        </p>
      </template>

      <template #body>
        <div
          v-if="hasValidAIEvaluation"
          class="space-y-4"
        >
          <p class="font-bold capitalize text-Sequand">
            {{ evaluationStore.aiEvaluation!.evaluation.level }}
          </p>

          <div>
            <p class="text-sm font-semibold">
              Weaknesses
            </p>
            <ul class="list-disc pl-4">
              <li
                v-for="w in evaluationStore.aiEvaluation!.evaluation.weaknesses"
                :key="w"
              >
                {{ w }}
              </li>
            </ul>
          </div>

          <div>
            <p class="text-sm font-semibold">
              Recommendations
            </p>
            <ul class="list-disc pl-4">
              <li
                v-for="r in evaluationStore.aiEvaluation!.evaluation.recommendations"
                :key="r"
              >
                {{ r }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

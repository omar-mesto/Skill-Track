<script setup lang="ts">
import { ref } from 'vue'
import CommentsTree from '@@/components/Questions/CommentsTree.vue'

defineProps<{
  solutions: any[]
}>()

const activeQuestionId = ref<string | null>(null)
</script>

<template>
  <div class="mt-8 border-t pt-6">
    <h3 class="text-lg font-bold mb-4 text-gray-800">
      Suggested Similar Questions
    </h3>

    <div class="space-y-4">
      <div
        v-for="solution in solutions"
        :key="solution._id"
        class="bg-gray-50 border rounded-xl p-4"
      >
        <div class="flex items-center gap-3 mb-2">
          <UAvatar
            :src="solution.solutionAuthor?.avatar
              ? `https://skill-track-gr0b.onrender.com/${solution.solutionAuthor.avatar}`
              : '/StudentLogin.png'"
            size="sm"
          />
          <div>
            <p class="font-semibold text-sm">
              {{ solution.solutionAuthor?.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ new Date(solution.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <p class="text-sm text-gray-700 mb-3">
          {{ solution.solutionContent }}
        </p>

        <div
          class="bg-white border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
          @click="activeQuestionId = solution.similarQuestion._id"
        >
          <p class="font-semibold text-primary">
            {{ solution.similarQuestion.title }}
          </p>
          <p class="text-xs text-gray-600 line-clamp-2">
            {{ solution.similarQuestion.content }}
          </p>
        </div>

        <div v-if="activeQuestionId === solution.similarQuestion._id" class="mt-4">
          <CommentsTree
            :target-id="solution.similarQuestion._id"
            target-type="question"
          />
        </div>
      </div>
    </div>
  </div>
</template>

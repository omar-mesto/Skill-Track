<script setup lang="ts">
import type { QuestionModel } from '@/models/questionModel'
import QuestionsMyQuestionList from '@/components/Questions/MyQuestionList.vue'

defineProps<{
  questions: QuestionModel[]
  isOwner?: boolean
}>()
</script>

<template>
  <QuestionsMyQuestionList v-if="isOwner === true" />

  <div
    v-else
    class="space-y-8 my-2"
  >
    <div
      v-if="questions && questions.length === 0"
      class="text-center text-gray-500 py-8"
    >
      No Question
    </div>

    <div
      v-for="q in questions"
      :key="q._id"
      class="bg-white border max-w-xl mx-auto rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="p-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="q.authorId?.avatar ? `https://skill-track-gr0b.onrender.com/${q.authorId.avatar}` : '/StudentLogin.png'"
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
      </div>

      <div class="p-4 space-y-3">
        <h3 class="font-bold text-lg text-gray-900">
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
          >
            {{ q.counters?.comments || 0 }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

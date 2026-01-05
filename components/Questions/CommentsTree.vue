<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAddComment, useDeleteComment, useMarkSolution } from '@@/queries/questions/index'
import ReactionBar from './ReactionBar.vue'
import type { CommentModel } from '~/models/questionModel'

const props = defineProps<{
  questionId: string
  comments: CommentModel[]
  canMarkSolution: boolean
  solutionCommentId: string | null
}>()

const emit = defineEmits(['refresh'])

const replyOpen = ref<Record<string, boolean>>({})
const replyText = ref<Record<string, string>>({})

const roots = computed(() => props.comments.filter(c => !c.parentCommentId))
const childrenOf = (id: string) => props.comments.filter(c => c.parentCommentId === id)

const addReply = async (parentId: string) => {
  const content = (replyText.value[parentId] || '').trim()
  if (!content) return

  const { execute } = useAddComment('question', props.questionId, { content, parentCommentId: parentId })
  await execute()

  replyText.value[parentId] = ''
  replyOpen.value[parentId] = false
  emit('refresh')
}

const addRoot = ref('')
const addComment = async () => {
  const content = addRoot.value.trim()
  if (!content) return

  const { execute } = useAddComment('question', props.questionId, { content, parentCommentId: null })
  await execute()

  addRoot.value = ''
  emit('refresh')
}

const deleteComment = async (id: string) => {
  const { execute } = useDeleteComment(id)
  await execute()
  emit('refresh')
}

const markSolution = async (commentId: string) => {
  const checked = props.solutionCommentId !== commentId
  const { execute } = useMarkSolution(commentId, checked)
  await execute()
  emit('refresh')
}
</script>

<template>
  <div class="mt-4">
    <div class="bg-gray-50 border rounded-xl p-3">
      <UTextarea
        v-model="addRoot"
        class="rounded-lg bg-white text-black block"
        size="xl"
        variant="subtle"
        placeholder="Write a comment..."
      />
      <div class="mt-2 flex justify-end">
        <UButton
          color="primary"
          class="rounded-full"
          @click="addComment"
        >
          Comment
        </UButton>
      </div>
    </div>

    <div class="space-y-4 mt-4">
      <div
        v-for="c in roots"
        :key="c._id"
        class="p-4 bg-gray-100 border rounded-xl"
      >
        <div class="flex justify-between items-start gap-3">
          <div class="w-full">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-black">User</span>
              <span class="text-xs text-gray-500">{{ c.authorId.role }}</span>

              <span
                v-if="solutionCommentId === c._id || c.acceptedBy?.author || c.acceptedBy?.professor"
                class="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200"
              >
                ✔ Solution
              </span>
            </div>

            <p class="text-gray-700 mt-1">
              {{ c.content }}
            </p>

            <div class="mt-3 flex flex-wrap gap-2 items-center">
              <ReactionBar
                target-type="comment"
                :target-id="c._id"
              />

              <UButton
                variant="ghost"
                class="rounded-full"
                @click="replyOpen[c._id] = !replyOpen[c._id]"
              >
                Reply
              </UButton>

              <UButton
                color="error"
                variant="ghost"
                class="rounded-full"
                @click="deleteComment(c._id)"
              >
                Delete
              </UButton>

              <UButton
                v-if="canMarkSolution"
                color="success"
                variant="ghost"
                class="rounded-full"
                @click="markSolution(c._id)"
              >
                Mark Solution
              </UButton>
            </div>

            <div
              v-if="replyOpen[c._id]"
              class="mt-3 bg-white border rounded-xl p-3"
            >
              <UTextarea
                v-model="replyText[c._id]"
                class="rounded-lg bg-white text-black block"
                size="xl"
                variant="subtle"
                placeholder="Write a reply..."
              />
              <div class="mt-2 flex justify-end">
                <UButton
                  color="primary"
                  class="rounded-full"
                  @click="addReply(c._id)"
                >
                  Send
                </UButton>
              </div>
            </div>

            <div class="mt-4 pl-4 border-l space-y-3">
              <div
                v-for="ch in childrenOf(c._id)"
                :key="ch._id"
                class="p-3 bg-white border rounded-xl"
              >
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-black">User</span>
                  <span class="text-xs text-gray-500">{{ ch.authorId.role }}</span>

                  <span
                    v-if="solutionCommentId === ch._id || ch.acceptedBy?.author || ch.acceptedBy?.professor"
                    class="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200"
                  >
                    ✔ Solution
                  </span>
                </div>

                <p class="text-gray-700 mt-1">
                  {{ ch.content }}
                </p>

                <div class="mt-2 flex flex-wrap gap-2 items-center">
                  <ReactionBar
                    target-type="comment"
                    :target-id="ch._id"
                  />

                  <UButton
                    color="error"
                    variant="ghost"
                    class="rounded-full"
                    @click="deleteComment(ch._id)"
                  >
                    Delete
                  </UButton>

                  <UButton
                    v-if="canMarkSolution"
                    color="success"
                    variant="ghost"
                    class="rounded-full"
                    @click="markSolution(ch._id)"
                  >
                    Mark Solution
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

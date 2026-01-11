<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetPostDetail } from '@@/queries/posts'
import { useAddComment } from '@@/queries/questions'
import ReactionBar from '~/components/Questions/ReactionBar.vue'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import CommentsTree from '~/components/Questions/CommentsTree.vue'

const newComment = ref('')
const isSending = ref(false)

const addComment = async () => {
  if (!newComment.value.trim() || !post.value) return

  isSending.value = true

  const { execute, status } = useAddComment(
    'post',
    post.value._id,
    { content: newComment.value, parentCommentId: null },
  )

  await execute()

  if (status.value === 'success') {
    newComment.value = ''
    await refresh()
  }

  isSending.value = false
}

const route = useRoute()
const sidebarOpen = ref(false)

const id = computed(() => route.params.id as string)

const { data, status, refresh } = useGetPostDetail(id.value)
const isLoading = computed(() => status.value === 'pending')

const post = computed(() => data.value?.data?.post ?? null)
const comments = computed(() => data.value?.data?.comments ?? [])
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex">
    <aside class="hidden lg:block w-72 h-screen sticky top-0 border-r border-slate-100 bg-white">
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

    <main class="flex-1 overflow-y-auto">
      <header class="lg:hidden p-4 flex items-center bg-white border-b sticky top-0 z-30">
        <MobileBackButton />
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          variant="ghost"
          color="info"
          @click="sidebarOpen = true"
        />
        <span class="ml-4 font-bold text-lg">
          Post Details
        </span>
      </header>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <div
          v-if="isLoading"
          class="space-y-4"
        >
          <USkeleton class="h-12 w-3/4" />
          <USkeleton class="h-64 w-full" />
        </div>

        <article
          v-else-if="post"
          class="bg-white rounded-2xl border shadow-sm overflow-hidden"
        >
          <div class="flex items-center gap-3 m-2">
            <UAvatar
              :src="post.authorId?.avatar ? `https://skill-track-gr0b.onrender.com/${post.authorId.avatar}` : '/StudentLogin.png'"
              size="md"
            />
            <div>
              <p class="font-semibold text-gray-900">
                {{ post.authorId?.email }}
              </p>
              <p class="text-xs text-gray-500">
                {{ new Date(post.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="p-6">
            <h1 class="text-3xl font-extrabold mb-4 text-black">
              {{ post.title }}
            </h1>

            <div class="prose max-w-none mb-6 text-black">
              {{ post.content }}
            </div>

            <img
              v-if="post.imageUrl"
              :src="`https://skill-track-gr0b.onrender.com/${post.imageUrl}`"
              class="w-full rounded-xl border mb-6"
            >

            <div class="flex items-center gap-6 py-4 border-t">
              <ReactionBar
                target-type="post"
                :target-id="post._id"
                :reactions="post.reactions"
                :my-reaction="post.myReaction"
              />
              <span class="text-sm text-gray-500">
                {{ comments.length }} Comments
              </span>
            </div>
          </div>

          <div class="bg-gray-50 p-6 border-t">
            <CommentsTree
              :target-id="post._id"
              target-type="post"
              :comments="comments"
              @refresh="refresh"
            />
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.prose {
  white-space: pre-line;
}
</style>

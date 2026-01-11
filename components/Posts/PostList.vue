<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetPosts } from '@@/queries/posts'
import ReactionBar from '~/components/Questions/ReactionBar.vue'

const page = ref(1)
const limit = ref(10)

const { data, status } = useGetPosts(page.value, limit.value)
const isLoading = computed(() => status.value === 'pending')

const posts = computed(() => data.value?.data.data ?? [])
const router = useRouter()
</script>

<template>
  <div class="space-y-8 max-w-xl mx-auto">
    <div
      v-for="p in posts"
      :key="p._id"
      class="bg-white border rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="p-4 flex items-center gap-3">
        <UAvatar
          :src="p.authorId?.avatar || '/StudentLogin.png'"
          size="md"
        />
        <div>
          <p class="font-semibold text-gray-900">
            {{ p.authorId?.name || 'User' }}
          </p>
          <p class="text-xs text-gray-500">
            {{ new Date(p.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <div
        v-if="p.imageUrl"
        class="w-full h-64 overflow-hidden"
      >
        <img
          :src="`https://skill-track-gr0b.onrender.com/${p.imageUrl}`"
          class="w-full h-full object-cover"
        >
      </div>

      <div class="p-4 space-y-3">
        <h3 class="font-bold text-lg">
          {{ p.title }}
        </h3>

        <p class="text-gray-700 text-sm">
          {{ p.content }}
        </p>

        <div class="flex justify-between items-center pt-3 border-t">
          <ReactionBar
            target-type="post"
            :target-id="p._id"
            :reactions="p.reactions"
            :my-reaction="p.myReaction"
          />

          <UButton
            icon="i-heroicons-chat-bubble-left"
            variant="ghost"
            color="info"
            @click="router.push(`/posts/${p._id}`)"
          >
            {{ p.counters.comments }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

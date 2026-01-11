<script setup lang="ts">
  import PostsMyPostList from '@@/components/Posts/PostList.vue'
import type { PostModel } from '@/models/postModel'

defineProps<{
  posts: PostModel[]
  isOwner?: boolean
}>()
</script>

<template>
  <PostsMyPostList v-if="isOwner === true" />

  <div
    v-else
    class="space-y-8 my-2"
  >
    <div
      v-if="posts.length === 0"
      class="text-center text-gray-500 py-8"
    >
      No Posts
    </div>

    <div
      v-for="p in posts"
      :key="p._id"
      class="bg-white border max-w-xl mx-auto rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="p-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="p.authorId?.avatar
              ? `https://skill-track-gr0b.onrender.com/${p.authorId.avatar}`
              : '/StudentLogin.png'"
            size="md"
          />
          <div>
            <p class="font-semibold text-gray-900">
              {{ p.authorId?.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ new Date(p.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 space-y-3">
        <h3 class="font-bold text-lg text-gray-900">
          {{ p.title }}
        </h3>

        <p class="text-gray-700 text-sm line-clamp-3">
          {{ p.content }}
        </p>

        <img
          v-if="p.imageUrl"
          :src="`https://skill-track-gr0b.onrender.com/${p.imageUrl}`"
          class="w-full rounded-xl border bg-gray-50"
        >
      </div>
    </div>
  </div>
</template>

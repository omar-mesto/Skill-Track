<script setup lang="ts">
import { ref } from 'vue'
import CreatePostModal from '@@/components/Posts/CreatePostModal.vue'
import type { PostModel } from '@/models/postModel'
import ReactionBar from '~/components/Questions/ReactionBar.vue'

const props = defineProps<{
  posts: PostModel[]
  isOwner?: boolean
}>()

const openCreate = ref(false)

const { refresh } = useProfile()
const onCreated = async () => {
  await refresh()
}
</script>

<template>
  <div
    v-if="isOwner === true"
    class="max-w-xl mx-auto space-y-4"
  >
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        class="rounded-full"
        @click="openCreate = true"
      >
        Create Post
      </UButton>
    </div>

    <CreatePostModal
      v-model="openCreate"
      @created="onCreated"
    />

    <div
      v-if="posts.length === 0"
      class="text-center text-gray-500 py-8"
    >
      No Posts
    </div>

    <div
      v-for="p in posts"
      :key="p._id"
      class="bg-white border rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="p-4 flex items-center gap-3">
        <UAvatar
          :src="(p as any).authorId?.avatar
            ? `https://skill-track-gr0b.onrender.com/${(p as any).authorId.avatar}`
            : '/StudentLogin.png'"
          size="md"
        />
        <div>
          <p class="font-semibold text-gray-900">
            {{ (p as any).authorId?.name || 'User' }}
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
            :reactions="(p as any).reactions"
            :my-reaction="(p as any).myReaction"
          />
        </div>
      </div>
    </div>
  </div>

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
            :src="(p as any).authorId?.avatar
              ? `https://skill-track-gr0b.onrender.com/${(p as any).authorId.avatar}`
              : '/StudentLogin.png'"
            size="md"
          />
          <div>
            <p class="font-semibold text-gray-900">
              {{ (p as any).authorId?.name || 'User' }}
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

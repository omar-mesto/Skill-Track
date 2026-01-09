<script setup lang="ts">
import { ref } from 'vue'
import CreatePostModal from '~/components/Posts/CreatePostModal.vue'

const openCreatePost = ref(false)
</script>

<template>
  <UButton
    color="primary"
    class="rounded-full"
    @click="openCreatePost = true"
  >
    Create Post
  </UButton>

  <CreatePostModal
    v-model="openCreatePost"
    @created="refresh()"
  />
</template>

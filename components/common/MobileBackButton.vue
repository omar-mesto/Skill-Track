<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    fallback?: string
    label?: string
  }>(),
  {
    fallback: '/',
    label: 'Back',
  },
)

const router = useRouter()

const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()

    return
  }
  router.push(props.fallback)
}
</script>

<template>
  <div class="sm:hidden flex items-center">
    <UButton
      icon="i-heroicons-arrow-left"
      variant="ghost"
      color="primary"
      size="sm"
      @click="goBack"
    >
      {{ label }}
    </UButton>
  </div>
</template>

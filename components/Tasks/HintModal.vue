<script setup lang="ts">
defineProps<{ hint: string }>()
defineEmits(['close'])
</script>

<template>
  <UModal>
    <div class="p-6 space-y-4">
      <h3 class="text-xl font-bold">
        AI Hint
      </h3>

      <p class="text-gray-700 whitespace-pre-line">
        {{ hint }}
      </p>

      <div class="flex justify-end">
        <UButton
          color="primary"
          @click="$emit('close')"
        >
          Got it
        </UButton>
      </div>
    </div>
  </UModal>
</template>

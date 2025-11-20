<script setup lang="ts">
defineProps({
  title: String,
  desc: String,
})
</script>

<template>
  <div class="p-4 bg-gray-50 text-black rounded-xl shadow-sm hover:shadow-md transition">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-blue-100 text-primary grid place-items-center rounded-xl">
        <i class="i-lucide-image w-6 h-6" />
      </div>

      <div>
        <p class="font-semibold">
          {{ title }}
        </p>
        <p class="text-sm text-gray-500">
          {{ desc }}
        </p>
      </div>
    </div>
  </div>
</template>

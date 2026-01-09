<script setup lang="ts">
import type { SubmissionModel } from '@/models/submissionModel'

defineProps<{ submission: SubmissionModel }>()
</script>

<template>
  <div class="border rounded-xl p-4 bg-gray-50">
    <p class="font-bold">
      {{ submission.student.email }}
    </p>
    <pre class="mt-2 bg-black text-green-400 p-3 rounded">
        {{ submission.codeAnswer }}
    </pre>
    <p class="text-sm mt-2">
      {{ submission.aiFeedback }}
    </p>
  </div>
</template>

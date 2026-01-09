<script setup lang="ts">
import type { TaskModel } from '~/models/taskModel'

const props = defineProps<{
  task: TaskModel
  role?: 'student' | 'company'
}>()

const router = useRouter()

const goToSubmissions = () => {
  router.push(`/tasks/${props.task._id}/submissions`)
}
</script>

<template>
  <UCard
    class="rounded-2xl shadow-2xl m-5 bg-white border-slate-200 hover:shadow-md transition cursor-pointer"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-2">
        <h3 class="text-lg font-extrabold text-slate-900 line-clamp-1">
          {{ task.title }}
        </h3>

        <p class="text-sm text-slate-600 line-clamp-2">
          {{ task.description }}
        </p>

        <div class="flex flex-wrap gap-2 mt-2">
          <UBadge
            v-for="skill in task.skills"
            :key="skill"
            size="xs"
            variant="soft"
            class="rounded-full bg-secondary/30 text-primary border border-secondary/40"
          >
            {{ skill }}
          </UBadge>
        </div>
      </div>

      <div class="flex flex-col items-end gap-2 shrink-0">
        <UBadge
          color="primary"
          variant="soft"
          class="rounded-full"
        >
          {{ task.basePoints }} pts
        </UBadge>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-clock"
          class="w-4 h-4"
        />
        <span>{{ task.durationMinutes }} min</span>
      </div>

      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-calendar-days"
          class="w-4 h-4"
        />
        <span>
          {{ new Date(task.endAt).toLocaleDateString() }}
        </span>
      </div>
    </div>
    <div class="w-full text-center">
      <slot />
    </div>

    <template
      v-if="role === 'company'"
      #footer
    >
      <div class="flex justify-end">
        <UButton
          size="sm"
          variant="outline"
          class="rounded-full"
          @click.stop="goToSubmissions"
        >
          View Submissions
        </UButton>
      </div>
    </template>
  </UCard>
</template>

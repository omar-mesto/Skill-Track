<script setup lang="ts">
import { ref } from 'vue'
import { useCreateTask, useGetCompanyTasks } from '@@/queries/tasks'
import TaskCard from '~/components/Tasks/TaskCard.vue'
import CodeEditor from '~/components/Tasks/CodeEditor.vue'
import type { CreateTaskPayload } from '~/models/taskModel'

const open = ref(false)

const { data, refresh } = useGetCompanyTasks()

const form = ref<CreateTaskPayload>({
  title: '',
  description: '',
  referenceSolution: '',
  startAt: '',
  endAt: '',
  language: '',
})

const submit = async () => {
  if (!form.value.startAt || !form.value.endAt) return

  const payload: CreateTaskPayload = {
    title: form.value.title,
    description: form.value.description,
    referenceSolution: form.value.referenceSolution,
    startAt: new Date(form.value.startAt).toISOString(),
    endAt: new Date(form.value.endAt).toISOString(),
    language: form.value.language || undefined,
  }

  const { execute, status } = useCreateTask(payload)
  await execute()

  if (status.value === 'success') {
    open.value = false
    form.value = {
      title: '',
      description: '',
      referenceSolution: '',
      startAt: '',
      endAt: '',
      language: '',
    }
    refresh()
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold text-gray-900">
        My Tasks
      </h1>

      <UButton
        color="primary"
        class="rounded-full"
        icon="i-heroicons-plus"
        @click="open = true"
      >
        Create Task
      </UButton>
    </div>

    <div class="space-y-4">
      <TaskCard
        v-for="t in data?.data"
        :key="t._id"
        :task="t"
        role="company"
      />
    </div>

    <USlideover
      v-model:open="open"
      class="bg-white shadow-xl"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #title>
        <h2 class="text-xl font-bold text-black">
          Add Task
        </h2>
      </template>

      <template #body>
        <div class="space-y-3">
          <label class="text-black">Title</label>
          <UInput
            v-model="form.title"
            class="w-full"
          />

          <label class="text-black">Description</label>
          <UTextarea
            v-model="form.description"
            class="w-full"
          />

          <label class="text-black">Language</label>
          <UInput
            v-model="form.language"
            placeholder="javascript / python / ..."
            class="w-full"
          />

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-black">Start At</label>
              <UInput
                v-model="form.startAt"
                type="date"
              />
            </div>
            <div>
              <label class="text-black">End At</label>
              <UInput
                v-model="form.endAt"
                type="date"
              />
            </div>
          </div>

          <label class="text-black">Reference Solution</label>
          <CodeEditor v-model="form.referenceSolution" />

          <UButton
            block
            color="primary"
            class="rounded-full"
            @click="submit"
          >
            Publish Task
          </UButton>
        </div>
      </template>
    </USlideover>
  </div>
</template>

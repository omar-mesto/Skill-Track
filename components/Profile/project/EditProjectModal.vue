<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ProjectModel } from '@@/models/projectModel'
import { useUpdateProject } from '@@/queries/Profile/student/project'
import { useErrorStore } from '@@/stores/error'
import { createProject } from '@@/schema/createProject'

const props = defineProps<{
  modelValue: ProjectModel | null
}>()

const emit = defineEmits(['update:modelValue', 'updated'])

const localOpen = computed({
  get: () => props.modelValue !== null,
  set: v => emit('update:modelValue', v ? props.modelValue : null),
})

const form = ref({
  title: '',
  description: '',
  github: '',
  demoUrl: '',
  technologies: [] as string[],
})

watch(
  () => props.modelValue,
  (p) => {
    if (p) {
      form.value = {
        title: p.title,
        description: p.description,
        github: p.github ?? '',
        demoUrl: p.demoUrl ?? '',
        technologies: [...p.technologies],
      }
    }
  },
  { immediate: true },
)

const projectId = computed(() => props.modelValue?._id)

const isLoading = ref(false)
const errorStore = useErrorStore()
const toast = useToast()

const update = async () => {
  if (!projectId.value) return

  isLoading.value = true

  const { data, status } = await useUpdateProject(projectId.value, {
    title: form.value.title,
    description: form.value.description,
    github: form.value.github,
    demoUrl: form.value.demoUrl,
    technologies: form.value.technologies,
  })

  if (status.value === 'success' && data.value) {
    toast.add({
      description: 'Project Update Susscfuly',
      color: 'success',
      class: 'bg-white text-black',
    })

    emit('updated')
    emit('update:modelValue', null)
  } else {
    toast.add({
      description: errorStore.message || '',
      color: 'error',
      class: 'bg-white text-black',
    })
  }

  isLoading.value = false
}
</script>

<template>
  <USlideover
    v-model:open="localOpen"
    class="bg-white shadow-xl"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <p class="text-black">
        Edit Project
      </p>
    </template>

    <template #body>
      <div class="p-4 space-y-5 text-black">
        <UForm
          :schema="createProject"
          :state="form"
          class="space-y-2"
          @submit="update"
        >
          <UFormField
            label="Title"
            name="title"
          >
            <UInput
              v-model="form.title"
              placeholder="Title"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>
          <UFormField
            label="Description"
            name="description"
          >
            <UTextarea
              v-model="form.description"
              placeholder="Description"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>
          <UFormField
            label="Ripo Link"
            name="github"
          >
            <UInput
              v-model="form.github"
              placeholder="GitHub URL"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>
          <UFormField
            label="Demo URL"
            name="demoUrl"
          >
            <UInput
              v-model="form.demoUrl"
              placeholder="Demo URL"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            class="bg-primary my-8 text-white h-12 rounded-full"
            :loading="isLoading"
            @click="update"
          >
            Save Changes
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>

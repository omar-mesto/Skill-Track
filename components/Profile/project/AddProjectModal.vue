<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCreateProject } from '@@/queries/Profile/student/project'
import { useGetMySkills, useLinkSkill } from '@@/queries/Profile/student/skill'
import { createProject } from '@@/schema/createProject'
import type { CreateProjectDto } from '@@/models/projectModel'
import { useErrorStore } from '@@/stores/error'

const props = defineProps({
  modelValue: Boolean,
})
const warningStore = useProjectWarningStore()

const emit = defineEmits(['update:modelValue', 'created'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref<CreateProjectDto>({
  title: '',
  description: '',
  github: '',
  link: '',
  technologies: [],
  skillsIds: [],
})

const newTech = ref('')
const addTech = () => {
  if (newTech.value.trim()) {
    form.value.technologies.push(newTech.value.trim())
    newTech.value = ''
  }
}

const removeTech = (i: number) => {
  form.value.technologies.splice(i, 1)
}

const { data: skillsData } = useGetMySkills()
const skills = computed(() => skillsData.value?.data ?? [])

const isLoading = ref(false)
const toast = useToast()
const errorStore = useErrorStore()

const submit = async () => {
  isLoading.value = true

  const { data, status } = await useCreateProject(form.value)

  if (status.value === 'success' && data.value) {
    const project = data.value.data
    const projectId = project._id

    for (const skillId of form.value.skillsIds) {
      await useLinkSkill(skillId, projectId, 'project')
    }

    if (data.value.message.includes('Warning')) {
      warningStore.setWarning(project._id, data.value.message)
    }

    emit('created', project)
    localOpen.value = false
    toast.add({ description: 'Project Created', color: 'success', class: 'text-black bg-white' })
  }
  else {
    toast.add({
      description: errorStore.message || '',
      color: 'error',
      class: 'text-black bg-white',
    })
  }
  isLoading.value = false
}
</script>

<template>
  <USlideover
    v-model:open="localOpen"
    class="bg-white shadow-xl"
    prevent-close
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <h2 class="text-xl font-bold text-black">
        Add Project
      </h2>
    </template>

    <template #body>
      <div class="p-4 text-black">
        <UForm
          :schema="createProject"
          :state="form"
          class="space-y-2"
          @submit="submit"
        >
          <UFormField
            label="Title"
            name="title"
          >
            <UInput
              v-model="form.title"
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
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UFormField
            label="GitHub URL"
            name="github"
          >
            <UInput
              v-model="form.github"
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
              v-model="form.link"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <div>
            <p class="font-semibold">
              Technologies
            </p>

            <div class="flex gap-2 mb-2">
              <UInput
                v-model="newTech"
                class=" rounded-lg flex-1 bg-white text-black block"
                size="xl"
                variant="subtle"
              />
              <UButton
                color="primary"
                class="text-white"
                @click="addTech"
              >
                Add
              </UButton>
            </div>

            <div class="flex gap-2 flex-wrap">
              <div
                v-for="(t, i) in form.technologies"
                :key="i"
                class="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
              >
                <span>{{ t }}</span>
                <button
                  class="text-red-600"
                  @click="removeTech(i)"
                >
                  x
                </button>
              </div>
            </div>
          </div>

          <div>
            <p class="font-semibold mb-2">
              Select Skills
            </p>

            <div class="flex flex-col gap-2">
              <label
                v-for="s in skills"
                :key="s._id"
                class="flex items-center gap-3"
              >
                <input
                  v-model="form.skillsIds"
                  type="checkbox"
                  :value="s._id"
                >
                <span>{{ s.name }}</span>
              </label>
            </div>
          </div>

          <UButton
            type="submit"
            :loading="isLoading"
            block
            class="bg-primary text-white h-12 rounded-full"
          >
            Create
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>

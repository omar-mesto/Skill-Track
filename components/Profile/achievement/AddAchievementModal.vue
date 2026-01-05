<script setup lang="ts">
import { ref } from 'vue'
import { useCreateAchievement } from '@@/queries/Profile/student/achievement'
import { useLinkSkill } from '@@/queries/Profile/student/skill'
import { createAchievement } from '@@/schema/createAchievement'
import type { SkillModel } from '~/models/skillModel'

const emit = defineEmits(['update:modelValue', 'created'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref({
  title: '',
  description: '',
  date: '',
  skillsIds: [],
})
const certificate = ref<File | null>(null)

const props = defineProps<{
  modelValue: boolean
  skills: SkillModel[]
}>()

const skills = computed(() => props.skills)

const isLoading = ref(false)
const toast = useToast()
const errorStore = useErrorStore()

const submit = async () => {
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('description', form.value.description)
  fd.append('date', form.value.date)
  if (certificate.value) fd.append('certificate', certificate.value)
  isLoading.value = true
  const { status, data } = await useCreateAchievement(fd)
  if (status.value === 'success' && data.value) {
    const achievement = data.value.data
    if (form.value.skillsIds.length > 0) {
      await useLinkSkill(
        form.value.skillsIds[0],
        achievement._id,
        'project',
        form.value.skillsIds,
      )
    }

    emit('created', achievement)
    localOpen.value = false
    toast.add({ description: 'Achievement Created', color: 'success', class: 'text-black bg-white' })
    emit('update:modelValue', false)
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
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <h2 class="text-xl font-bold text-black">
        Add Achievement
      </h2>
    </template>

    <template #body>
      <div class="p-4">
        <UForm
          :state="form"
          :schema="createAchievement"
          class="space-y-3 text-black"
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

          <UFormField label="Description">
            <UTextarea
              v-model="form.description"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UFormField label="Date">
            <UInput
              v-model="form.date"
              type="date"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

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

          <UButton
            type="submit"
            :loading="isLoading"
            block
            class="bg-primary text-white h-12 rounded-full my-5"
          >
            Create
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>

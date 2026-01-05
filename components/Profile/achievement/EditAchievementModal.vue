<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUpdateAchievement } from '@@/queries/Profile/student/achievement'
import type { AchievementModel } from '~/models/AchievementModel'

const props = defineProps<{ modelValue: AchievementModel | null }>()
const emit = defineEmits(['update:modelValue', 'updated'])

const localOpen = computed({
  get: () => props.modelValue !== null,
  set: v => emit('update:modelValue', v ? props.modelValue : null),
})

watch(
  () => props.modelValue,
  (p) => {
    if (p) {
      form.value.title = p.title
      form.value.description = p.description
      form.value.date = p.date?.split('T')[0] || ''
    }
  },
  { immediate: true },
)

const form = ref({
  title: '',
  description: '',
  date: '',
})

const certificate = ref<File | null>(null)

// const onFileChange = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   if (!target.files) return
//   certificate.value = target.files[0]
// }

const isLoading = ref(false)
const toast = useToast()

const update = async () => {
  if (!props.modelValue) return

  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('description', form.value.description)
  fd.append('date', form.value.date)

  if (certificate.value) fd.append('certificate', certificate.value)

  isLoading.value = true
  const { status } = await useUpdateAchievement(props.modelValue._id, fd)

  if (status.value === 'success') {
    toast.add({ description: 'Achievement Updated', color: 'success', class: 'text-black bg-white' })
    emit('updated')
    emit('update:modelValue', null)
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
        Edit Achievement
      </p>
    </template>

    <template #body>
      <div class="p-4 space-y-5 text-black">
        <UForm
          :state="form"
          @submit="update"
        >
          <UFormField label="Title">
            <UInput
              v-model="form.title"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UFormField
            label="Description"
            class="my-5"
          >
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

          <UButton
            block
            type="submit"
            class="bg-primary text-white h-12 my-5 rounded-full"
            :loading="isLoading"
          >
            Save Changes
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>

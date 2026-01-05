<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVerifyCoursera } from '@@/queries/Profile/student/coursera'
import { useLinkSkill } from '@@/queries/Profile/student/skill'
import { useCourseraStore } from '@@/stores/courseraStore'
import { useErrorStore } from '@@/stores/error'
import { courseraSchema } from '@@/schema/courseraSchema'
import type { SkillModel } from '~/models/skillModel'
import type { VerifyCourseraDto } from '~/models/courseraModel'

const props = defineProps<{
  modelValue: boolean
  skills: SkillModel[]
}>()

const emit = defineEmits(['update:modelValue', 'changed'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
const form = ref<VerifyCourseraDto>({
  shareUrl: '',
})
const selectedSkills = ref<string[]>([])
const isLoading = ref(false)

const toast = useToast()
const errorStore = useErrorStore()
const courseraStore = useCourseraStore()

const submit = async () => {
  if (isLoading.value) return
  isLoading.value = true

  const { data, status } = await useVerifyCoursera(form.value)

  if (status.value === 'success' && data.value) {
    const certificate = data.value.data

   if (selectedSkills.value.length > 0) {
      await useLinkSkill(
        selectedSkills.value[0],
        certificate._id,
        'certificate',
        selectedSkills.value,
      )
    }

    courseraStore.addCertificate({
      ...certificate,
      warning: data.value.message.includes('mismatch')
        ? data.value.message
        : null,
    })

    emit('changed')
    form.value.shareUrl = ''
    selectedSkills.value = []

    localOpen.value = false
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
    prevent-close
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <h2 class="text-xl font-bold text-black">
        Add Coursera Certificate
      </h2>
    </template>

    <template #body>
      <div class="p-4 space-y-4 text-black">
        <UForm
          :state="form"
          :schema="courseraSchema"
          class="space-y-4"
          @submit="submit"
        >
          <UFormField
            label="Coursera Certificate URL"
            name="shareUrl"
          >
            <UInput
              v-model="form.shareUrl"
              class=" rounded-lg bg-white text-black block w-full"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <div>
            <p class="font-semibold mb-2">
              Select Skills
            </p>

            <div class="flex flex-col gap-2">
              <label
                v-for="s in props.skills"
                :key="s._id"
                class="flex items-center gap-3"
              >
                <input
                  v-model="selectedSkills"
                  type="checkbox"
                  :value="s._id"
                >
                <span>{{ s.name }}</span>
              </label>
            </div>
          </div>

          <UButton
            type="submit"
            block
            class="bg-primary text-white h-12 rounded-full"
            :loading="isLoading"
          >
            Add Certificate
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>

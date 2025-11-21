<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { companyProfileResponse } from '@@/models/profileInformationModel'
import { useUpdateCompanyProfile } from '@@/queries/Profile/company/information'

const props = defineProps<{
  modelValue: boolean
  profile: companyProfileResponse['data'] | null
}>()

const emit = defineEmits(['update:modelValue', 'updated'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref({
  companyName: '',
  bio: '',
})

const newAvatar = ref<File | null>(null)
const newCover = ref<File | null>(null)

watch(
  () => props.profile,
  p => {
    if (p) {
      form.value.companyName = p.companyName
      form.value.bio = p.bio || ''
    }
  },
  { immediate: true },
)

const onAvatarChange = (e: Event) => {
  const t = e.target as HTMLInputElement
  if (t.files) newAvatar.value = t.files[0]
}

const onCoverChange = (e: Event) => {
  const t = e.target as HTMLInputElement
  if (t.files) newCover.value = t.files[0]
}

const isSaving = ref(false)
const toast = useToast()

const update = async () => {
  if (!props.profile) return

  const fd = new FormData()
  fd.append('companyName', form.value.companyName)
  fd.append('bio', form.value.bio)

  if (newAvatar.value) fd.append('avatar', newAvatar.value)
  if (newCover.value) fd.append('coverImage', newCover.value)

  isSaving.value = true
  const { status, execute } = await useUpdateCompanyProfile(fd)
  await execute()

  if (status.value === 'success') {
    toast.add({ description: 'Company Profile Updated', color: 'success', class: 'text-black bg-white' })
    emit('updated')
    emit('update:modelValue', false)
  }

  isSaving.value = false
}
</script>

<template>
  <USlideover
    v-model:open="localOpen"
    class="bg-white p-4 shadow-2xl"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <h2 class="text-xl font-bold text-black">
        Edit Company Profile
      </h2>
    </template>

    <template #body>
      <UForm
        class="space-y-4 text-black"
        :state="form"
        @submit="update"
      >
        <UFormField label="Company Name">
          <UInput
            v-model="form.companyName"
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="Bio">
          <UTextarea
            v-model="form.bio"
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="Avatar">
          <input
            type="file"
            accept="image/*"
            class="block border p-2 rounded-lg w-full"
            @change="onAvatarChange"
          >
        </UFormField>

        <UFormField label="Cover Image">
          <input
            type="file"
            class="block border p-2 rounded-lg w-full"
            accept="image/*"
            @change="onCoverChange"
          >
        </UFormField>

        <UButton
          block
          type="submit"
          :loading="isSaving"
          class="bg-primary text-white rounded-full h-12"
        >
          Save Changes
        </UButton>
      </UForm>
    </template>
  </USlideover>
</template>

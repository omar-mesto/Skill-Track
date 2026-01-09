<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCreatePost } from '@@/queries/posts'
import { useErrorStore } from '@@/stores/error'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'created'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref({
  title: '',
  content: '',
  linkUrl: '',
})

const postImage = ref<File | null>(null)
const onImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (!target?.files?.length) return
  postImage.value = target.files[0]
}

const isLoading = ref(false)
const toast = useToast()
const errorStore = useErrorStore()

const submit = async () => {
  isLoading.value = true

  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  if (form.value.linkUrl) fd.append('linkUrl', form.value.linkUrl)
  if (postImage.value) fd.append('image', postImage.value)

  const { execute, status, data } = useCreatePost(fd)
  await execute()

  if (status.value === 'success' && data.value?.data) {
    toast.add({
      description: 'Post Created',
      color: 'success',
      class: 'text-black bg-white',
    })

    emit('created', data.value.data)
    emit('update:modelValue', false)

    form.value = { title: '', content: '', linkUrl: '' }
    postImage.value = null
  } else {
    toast.add({
      description: errorStore.message || 'Error',
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
    :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
  >
    <template #title>
      <h2 class="text-xl font-bold text-black">
        Create Post
      </h2>
    </template>

    <template #body>
      <div class="p-4 text-black">
        <UForm
          :state="form"
          class="space-y-3"
          @submit="submit"
        >
          <UFormField label="Title">
            <UInput
              v-model="form.title"
              class="rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UFormField label="Content">
            <UTextarea
              v-model="form.content"
              class="rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UFormField label="Link">
            <UInput
              v-model="form.linkUrl"
              class="rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>

          <UFormField label="Image">
            <input
              type="file"
              accept="image/*"
              class="block border p-2 rounded-lg w-full"
              @change="onImageChange"
            >
          </UFormField>

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

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import type { UpdateProfileDto, ProfileResponse } from '@@/models/profileInformationModel'
import { useUpdateProfile } from '@@/queries/Profile/student/information'
import { usePositions } from '@@/composables/usePositions'

const props = defineProps<{
  modelValue: boolean
  profile: ProfileResponse['data'] | null
}>()

const newAvatar = ref<File | null>(null)
const newCover = ref<File | null>(null)

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (!target || !target.files) return
  newAvatar.value = target.files[0]
}

const onCoverChange = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (!target || !target.files) return
  newCover.value = target.files[0]
}

const emit = defineEmits(['update:modelValue', 'updated'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref<UpdateProfileDto>({
  fullName: '',
  bio: '',
  university: '',
  phone: '',
  address: '',
  postion: '',
})

const { positions, loadPositions } = usePositions()
const positionSearch = ref('')
const isPositionDropdownOpen = ref(false)
const toast = useToast()

watch(
  () => props.profile,
  p => {
    if (p) {
      form.value = {
        fullName: p.fullName,
        bio: p.bio || '',
        university: p.university || '',
        phone: p.phone || '',
        address: p.address || '',
        postion: p.postion || '',
      }
      positionSearch.value = p.postion || ''
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadPositions()
})

const filteredPositions = computed(() => {
  if (!positionSearch.value.trim()) {
    return positions.value.slice(0, 10)
  }
  const q = positionSearch.value.toLowerCase()

  return positions.value
    .filter(p =>
      (p.display_name || p.name).toLowerCase().includes(q),
    )
    .slice(0, 10)
})

const pickPosition = (p: { name: string; display_name: string | null }) => {
  const label = p.display_name || p.name
  form.value.postion = label
  positionSearch.value = label
  isPositionDropdownOpen.value = false
}

const isSaving = ref(false)

const update = async () => {
  isSaving.value = true

  const fd = new FormData()

  fd.append('fullName', form.value.fullName)
  fd.append('bio', form.value.bio)
  fd.append('university', form.value.university)
  fd.append('phone', form.value.phone)
  fd.append('address', form.value.address)
  fd.append('postion', form.value.postion)

  if (newAvatar.value) fd.append('avatar', newAvatar.value)
  if (newCover.value) fd.append('coverImage', newCover.value)

  const { execute, status } = useUpdateProfile(fd)
  await execute()

  if (status.value === 'success') {
    useToast().add({ description: 'Profile updated', color: 'success', class: 'text-black bg-white' })

    const { refresh } = useProfile()
    await refresh()

    emit('updated')
    emit('update:modelValue', false)
  }

  isSaving.value = false
}
</script>

<template>
  <USlideover
    v-model:open="localOpen"
    class="bg-white p-4"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <h2 class="text-xl font-bold text-black">
        Edit Profile
      </h2>
    </template>

    <template #body>
      <UForm
        :state="form"
        class="space-y-3 text-black"
        @submit="update"
      >
        <UFormField label="Full Name">
          <UInput
            v-model="form.fullName"
            disabled
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="Email">
          <UInput
            :value="props.profile?.user.email || ''"
            disabled
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="Position">
          <div class="relative">
            <UInput
              v-model="positionSearch"
              placeholder="Search position (Front end, Back end, ...)"
              class="rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
              @focus="isPositionDropdownOpen = true"
              @input="isPositionDropdownOpen = true"
            />

            <div
              v-if="isPositionDropdownOpen && filteredPositions.length"
              class="absolute left-0 right-0 z-20 mt-1 max-h-64 bg-white border rounded-lg shadow overflow-y-auto"
            >
              <button
                v-for="item in filteredPositions"
                :key="item.name"
                type="button"
                class="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                @click="pickPosition(item)"
              >
                <div class="font-medium">
                  {{ item.display_name || item.name }}
                </div>
                <div
                  v-if="item.short_description"
                  class="text-xs text-gray-500"
                >
                  {{ item.short_description }}
                </div>
              </button>
            </div>
          </div>
        </UFormField>

        <UFormField label="Bio">
          <UTextarea
            v-model="form.bio"
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="Phone">
          <UInput
            v-model="form.phone"
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="University">
          <UInput
            v-model="form.university"
            class="rounded-lg bg-white text-black block"
            size="xl"
            variant="subtle"
          />
        </UFormField>

        <UFormField label="Address">
          <UInput
            v-model="form.address"
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
            accept="image/*"
            class="block border p-2 rounded-lg w-full"
            @change="onCoverChange"
          >
        </UFormField>

        <UButton
          type="submit"
          :loading="isSaving"
          block
          color="primary"
          class="bg-primary text-white h-12 rounded-full"
        >
          Save
        </UButton>
      </UForm>
    </template>
  </USlideover>
</template>

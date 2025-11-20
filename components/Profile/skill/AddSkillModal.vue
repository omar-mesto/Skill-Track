<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCreateSkill } from '@@/queries/Profile/student/skill'
import type { CreateSkillDto } from '@@/models/skillModel'
import { createSkill } from '@@/schema/createSkill'
import { useErrorStore } from '@@/stores/error'
import type { RadioGroupItem } from '@nuxt/ui'
import { useSkills } from '@@/composables/useSkills'
import { URadioGroup, UTextarea } from '#components'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'created'])

const localOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const form = ref<CreateSkillDto>({
  name: '',
  description: '',
  level: 'beginner',
})

const { skills, loadSkills } = useSkills()
const search = ref('')
const isDropdownOpen = ref(false)

onMounted(() => {
  loadSkills()
})

const filtered = computed(() => {
  if (!search.value.trim()) return skills.value.slice(0, 10)

  const q = search.value.toLowerCase()

return skills.value
    .filter(s => s.toLowerCase().includes(q))
    .slice(0, 10)
})

const pickSkill = (skill: string) => {
  form.value.name = skill
  search.value = skill
  isDropdownOpen.value = false
}

const isLoading = ref(false)
const errorStore = useErrorStore()
const toast = useToast()

const submit = async () => {
  isLoading.value = true
  const { status } = await useCreateSkill(form.value)

  if (status.value === 'success') {
    toast.add({ description: 'Skill Created', color: 'success', class: 'text-black bg-white' })
    emit('created')
    emit('update:modelValue', false)
  } else {
    toast.add({
      description: errorStore.message || '',
      color: 'error',
      class: 'text-black bg-white',
    })
  }

  isLoading.value = false
}

const items = ref<RadioGroupItem[]>([
  {
    label: 'beginner',
    value: 'beginner',
  },
  {
    label: 'intermediate',
    value: 'intermediate',
  },
  {
    label: 'advanced',
    value: 'advanced',
  },
])
const value = ref('beginner')
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
        Add Skill
      </h2>
    </template>

    <template #body>
      <UForm
        :schema="createSkill"
        :state="form"
        class="space-y-4 text-black"
        @submit="submit"
      >
        <UFormField
          label="Skill"
          name="name"
        >
          <div class="relative">
            <UInput
              v-model="search"
              placeholder="Search for a skill (e.g. python)"
              class=" rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
              @focus="isDropdownOpen = true"
              @input="isDropdownOpen = true"
            />

            <div
              v-if="isDropdownOpen && filtered.length"
              class="absolute left-0 right-0 z-20 mt-1 max-h-64 bg-white border rounded-lg shadow overflow-y-auto"
            >
              <button
                v-for="item in filtered"
                :key="item"
                type="button"
                class="block w-full text-left px-3 py-2 hover:bg-gray-100"
                @click="pickSkill(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>
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
          label="Level"
          name="level"
        >
          <URadioGroup
            v-model="value"
            :items="items"
          />
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
    </template>
  </USlideover>
</template>

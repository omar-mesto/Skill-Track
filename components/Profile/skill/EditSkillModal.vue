<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useSkills } from '@@/composables/useSkills'
import { useUpdateSkill } from '@@/queries/Profile/student/skill'
import type { SkillModel } from '@@/models/skillModel'
import { useErrorStore } from '@@/stores/error'
import type { RadioGroupItem } from '@nuxt/ui'

const props = defineProps<{
  modelValue: SkillModel | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: SkillModel | null): void
  (e: 'updated'): void
}>()

const toast = useToast()
const form = ref({
  name: '',
  description: '',
  level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
})

const isLoading = ref(false)
const errorStore = useErrorStore()

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

const pickSkill = (s: string) => {
  form.value.name = s
  search.value = s
  isDropdownOpen.value = false
}

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        name: v.name,
        description: v.description,
        level: v.level,
      }
      search.value = v.name
    }
  },
)

const localOpen = computed({
  get: () => props.modelValue !== null,
  set: v => emit('update:modelValue', null),
})

const update = async () => {
  if (!props.modelValue) return

  isLoading.value = true

  const { status } = await useUpdateSkill(props.modelValue._id, form.value)

  if (status.value === 'success') {
    emit('updated')
    emit('update:modelValue', null)
  } else {
    console.error(errorStore.message)
  }
  toast.add({ description: 'Updated Successfully', color: 'success', class: 'text-black bg-white' })
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
        Edit Skill
      </h2>
    </template>

    <template #body>
      <UForm
        :state="form"
        class="space-y-4 text-black"
        @submit="update"
      >
        <UFormField
          label="Skill"
          name="name"
        >
          <div class="relative">
            <UInput
              v-model="search"
              placeholder="Search skill..."
              class="rounded-lg bg-white text-black block"
              size="xl"
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
            class="rounded-lg bg-white text-black block"
            size="xl"
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
          Update
        </UButton>
      </UForm>
    </template>
  </USlideover>
</template>

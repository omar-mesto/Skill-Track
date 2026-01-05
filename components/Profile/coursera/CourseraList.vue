<script setup lang="ts">
import { ref } from 'vue'
import { useDeleteCoursera } from '@@/queries/Profile/student/coursera'
import { useCourseraStore } from '@@/stores/courseraStore'
import AddCourseraModal from './AddCourseraModal.vue'
import type { SkillModel } from '~/models/skillModel'
import type { CourseraCertificateModel } from '~/models/courseraModel'

const openAdd = ref(false)
const courseraStore = useCourseraStore()
const emit = defineEmits(['changed', 'deleted'])

const props = defineProps<{
  certificates: CourseraCertificateModel[]
  isOwner: boolean
  skills: SkillModel[]
  loading?: boolean
}>()
const certificatesComputed = computed(() => courseraStore.certificates)
const deleteCoursera = async (id: string) => {
  const { execute } = useDeleteCoursera(id)
  await execute()
  emit('deleted', id)
  emit('changed')
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6 mx-3 sm:mx-6">
    <div class="flex justify-between mb-4">
      <h3 class="text-xl font-bold text-black">
        Coursera Certificates
      </h3>

      <UButton
        v-if="isOwner"
        color="primary"
        class="rounded-full"
        @click="openAdd = true"
      >
        Add
      </UButton>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="p-4 bg-gray-100 rounded-xl animate-pulse"
      >
        <div class="h-4 w-2/3 bg-gray-300 rounded mb-2" />
        <div class="h-3 w-full bg-gray-300 rounded" />
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="c in certificatesComputed"
        :key="c._id"
        class="p-5 bg-gray-100 rounded-xl shadow-sm border border-gray-200"
      >
        <div class="flex justify-between items-start">
          <p class="font-bold text-black text-lg">
            {{ c.title }}
          </p>

          <UButton
            v-if="isOwner"
            color="error"
            class="w-9 h-9 rounded-full"
            @click="deleteCoursera(c._id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bookmark-x"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
              <path d="m14.5 7.5-5 5" />
              <path d="m9.5 7.5 5 5" />
            </svg>
          </UButton>
        </div>

        <p class="text-sm text-gray-600 mt-2">
          {{ c.description }}
        </p>

        <div
          v-if="c.warning"
          class="mt-3 p-2 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded"
        >
          {{ c.warning }}
        </div>
        <a
          :href="c.certificate"
          target="_blank"
          class="text-primary text-sm underline block mt-2"
        >
          View Certificate
        </a>
      </div>
    </div>

    <AddCourseraModal
      v-model="openAdd"
      :skills="skills"
      @changed="emit('changed')"
    />
  </div>
</template>

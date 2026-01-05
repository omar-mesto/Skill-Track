  <script setup lang="ts">
import { ref } from 'vue'
import { useDeleteAchievement } from '@@/queries/Profile/student/achievement'
import AddAchievementModal from './AddAchievementModal.vue'
import EditAchievementModal from './EditAchievementModal.vue'
import type { AchievementModel } from '~/models/AchievementModel'
import type { SkillModel } from '~/models/skillModel'

const emit = defineEmits(['changed'])

const props = defineProps<{
  achievements: AchievementModel[]
  isOwner: boolean
  loading?: boolean
  skills: SkillModel[]
}>()

const openAdd = ref(false)
const editData = ref<AchievementModel | null>(null)
const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString() : 'No date'

const deleteAchievement = async (id: string) => {
  await useDeleteAchievement(id)
  emit('changed')
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6 mx-3 sm:mx-6">
    <div class="flex justify-between mb-4">
      <h3 class="text-xl font-bold text-black">
        Achievements
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
      v-if="props.loading"
      class="space-y-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="p-4 bg-gray-100 rounded-xl border animate-pulse"
      >
        <div class="h-4 w-1/3 bg-gray-300 rounded mb-3" />
        <div class="h-3 w-2/3 bg-gray-300 rounded mb-2" />
        <div class="h-2 w-full bg-gray-300 rounded" />
      </div>
    </div>

    <div
      v-for="a in achievements"
      v-else
      :key="a._id"
      class="p-4 bg-gray-100 my-3 border rounded-xl"
    >
      <div class="flex justify-between">
        <p class="font-bold text-black text-lg">
          {{ a.title }}
        </p>

        <div class="flex gap-x-3">
          <UButton
            v-if="isOwner"
            color="warning"
            class="w-9 h-9 rounded-full"
            @click="editData = a"
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
              class="lucide lucide-pencil-icon lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          </UButton>

          <UButton
            v-if="isOwner"
            color="error"
            class="w-9 h-9 rounded-full"
            @click="deleteAchievement(a._id)"
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
              class="lucide lucide-bookmark-x-icon lucide-bookmark-x"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
              <path d="m14.5 7.5-5 5" />
              <path d="m9.5 7.5 5 5" />
            </svg>
          </UButton>
        </div>
      </div>

      <p class="text-gray-600">
        {{ a.description }}
      </p>
      <p class="text-gray-500 text-sm">
        Date: {{ formatDate(a.date) }}
      </p>
    </div>

    <AddAchievementModal
      v-model="openAdd"
      :skills="skills"
      @created="emit('changed')"
    />

    <EditAchievementModal
      v-model="editData"
      @updated="emit('changed')"
    />
  </div>
</template>

<script setup lang="ts">
import { useGetAchievements, useDeleteAchievement } from '@@/queries/Profile/student/achievement'
import { computed, ref } from 'vue'
import AddAchievementModal from './AddAchievementModal.vue'
import EditAchievementModal from './EditAchievementModal.vue'
import type { AchievementModel } from '~/models/AchievementModel'

const openAdd = ref(false)
const editData = ref<AchievementModel | null>(null)

const { data, refresh } = useGetAchievements()
const achievements = computed(() => data.value?.data ?? [])

const deleteAchievement = async (id: string) => {
  await useDeleteAchievement(id)
  refresh()
}

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString() : 'No date'
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6 mx-3 sm:mx-6">
    <div class="flex justify-between mb-4">
      <h3 class="text-xl font-bold text-black">
        Achievements
      </h3>

      <UButton
        color="primary"
        class="rounded-full"
        @click="openAdd = true"
      >
        Add
      </UButton>
    </div>

    <div class="space-y-4">
      <div
        v-for="a in achievements"
        :key="a._id"
        class="p-4 bg-gray-100 border rounded-xl"
      >
        <div class="flex justify-between">
          <p class="font-bold text-black text-lg">
            {{ a.title }}
          </p>

          <div class="flex gap-x-3">
            <UButton
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
              ><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
            </UButton>

            <UButton
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
              ><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" /><path d="m14.5 7.5-5 5" /><path d="m9.5 7.5 5 5" /></svg>
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
    </div>

    <AddAchievementModal
      v-model="openAdd"
      @created="refresh()"
    />
    <EditAchievementModal
      v-model="editData"
      @updated="refresh()"
    />
  </div>
</template>

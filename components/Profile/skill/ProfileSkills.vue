<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetMySkills, useDeleteSkill } from '@@/queries/Profile/student/skill'
import AddSkillModal from './AddSkillModal.vue'
import EditSkillModal from './EditSkillModal.vue'
import type { SkillModel } from '~/models/skillModel'

const { data, refresh } = useGetMySkills()

const openAdd = ref(false)
const editData = ref<SkillModel | null>(null)

const skills = computed(() => {
  if (!data.value) return []

  return data.value.data.map(skill => {
    const projectCount = skill.linkedProjects.length
    const achievementCount = skill.linkedAchievements.length
    const certificateCount = skill.linkedCertificates.length

    let projectScore = 0
    if (projectCount >= 4) projectScore = 40
    else if (projectCount === 3) projectScore = 30
    else if (projectCount === 2) projectScore = 20
    else if (projectCount === 1) projectScore = 10

    let achievementScore = 0
    if (achievementCount >= 5) achievementScore = 40
    else if (achievementCount === 3 || achievementCount === 4) achievementScore = 30
    else if (achievementCount === 2) achievementScore = 20
    else if (achievementCount === 1) achievementScore = 10

    let certificateScore = 0
    if (certificateCount >= 2) certificateScore = 20
    else if (certificateCount === 1) certificateScore = 10

    const progress = Math.min(projectScore + achievementScore + certificateScore, 100)

    return { ...skill, progress }
  })
})

const deleteSkill = async (id: string) => {
  await useDeleteSkill(id)
  refresh()
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6 mx-3 sm:mx-6">
    <div class="flex justify-between mb-4">
      <h3 class="font-bold text-black text-lg sm:text-xl">
        Skills
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
        v-for="skill in skills"
        :key="skill._id"
        class="p-4 bg-gray-100 rounded-xl shadow-sm border"
      >
        <div class="flex justify-between items-start">
          <p class="font-semibold text-black text-lg">
            {{ skill.name }} <span class="text-primary text-sm">({{ skill.level }})</span>
          </p>

          <div class="sm:flex block justify-end gap-x-3">
            <UButton
              color="warning"
              class="w-9 h-9  rounded-full"
              @click="editData = skill"
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
              class="w-9 h-9 sm:my-0 my-2 rounded-full"
              @click="deleteSkill(skill._id)"
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

        <p class="text-gray-600 text-sm">
          {{ skill.description }}
        </p>

        <div class="mt-3">
          <div class="bg-gray-300 h-2 rounded-full">
            <div
              class="bg-Sequand h-full rounded-full"
              :style="{ width: skill.progress + '%' }"
            />
          </div>
          <p class="text-xs text-gray-600 mt-1">
            {{ skill.progress }}%
          </p>
        </div>
      </div>
    </div>

    <AddSkillModal
      v-model="openAdd"
      @created="refresh()"
    />
    <EditSkillModal
      v-model="editData"
      @updated="refresh()"
    />
  </div>
</template>

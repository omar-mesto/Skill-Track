<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDeleteSkill } from '@@/queries/Profile/student/skill'
import ViewSkillModal from './ViewSkillModal.vue'
import AddSkillModal from './AddSkillModal.vue'
import EditSkillModal from './EditSkillModal.vue'
import type { SkillModel } from '~/models/skillModel'
import type { ProjectModel } from '~/models/projectModel'
import type { AchievementModel } from '~/models/AchievementModel'
import type { CourseraCertificateModel } from '~/models/courseraModel'

const props = defineProps<{
  skills: SkillModel[]
  projects: ProjectModel[]
  achievements: AchievementModel[]
  certificates: CourseraCertificateModel[]
  isOwner: boolean
  loading?: boolean
}>()

const emit = defineEmits(['changed'])

const openAdd = ref(false)
const editData = ref<SkillModel | null>(null)
const viewSkillId = ref<string | null>(null)
const Skills = computed(() => {
  return props.skills.map(skill => {
    const projectCount = skill.linkedProjects?.length ?? 0
    const achievementCount = skill.linkedAchievements?.length ?? 0
    const certificateCount = skill.linkedCertificates?.length ?? 0

    const projectScore = Math.min(projectCount, 4) * 10
    const achievementScore = Math.min(achievementCount, 4) * 10
    const certificateScore = Math.min(certificateCount, 2) * 10

    return {
      ...skill,
      progress: projectScore + achievementScore + certificateScore,
    }
  })
})

const deleteSkill = async (id: string) => {
  const { execute, status } = useDeleteSkill(id)
  await execute()
  if (status.value === 'success') {
    emit('changed')
  }
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6 mx-3 sm:mx-6">
    <div class="flex justify-between mb-4">
      <h3 class="font-bold text-black text-lg sm:text-xl">
        Skills
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

    <div class="space-y-4">
      <div
        v-for="skill in Skills"
        :key="skill._id"
        class="p-4 bg-gray-100 rounded-xl hover:cursor-pointer shadow-sm border"
        @click="viewSkillId = skill._id"
      >
        <div class="flex justify-between items-start">
          <p class="font-semibold text-black text-lg">
            {{ skill.name }} <span class="text-primary text-sm">({{ skill.level }})</span>
          </p>
          <div class="sm:flex block justify-end gap-x-3">
            <UButton
              v-if="isOwner"
              color="warning"
              class="w-9 h-9 rounded-full"
              @click="editData = skill"
              @click.stop="editData = skill"
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
                class="lucide lucide-pencil"
              ><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
            </UButton>
            <UButton
              v-if="isOwner"
              color="error"
              class="w-9 h-9 rounded-full"
              @click="deleteSkill(skill._id)"
              @click.stop="deleteSkill(skill._id)"
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
              class="bg-Sequand h-full rounded-full transition-all duration-500"
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
      @created="emit('changed')"
    />
    <EditSkillModal
      v-model="editData"
      @updated="emit('changed')"
    />
    <ViewSkillModal
      v-model="viewSkillId"
    />
  </div>
</template>

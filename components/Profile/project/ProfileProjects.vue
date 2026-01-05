<script setup lang="ts">
import { ref } from 'vue'
import { useDeleteProject } from '@@/queries/Profile/student/project'
import EditProjectModal from './EditProjectModal.vue'
import AddProjectModal from '~/components/Profile/project/AddProjectModal.vue'
import type { ProjectModel } from '~/models/projectModel'
import type { SkillModel } from '~/models/skillModel'

const openAdd = ref(false)
const editData = ref<ProjectModel | null>(null)
const warningStore = useProjectWarningStore()
const emit = defineEmits(['changed', 'deleted'])

const props = defineProps<{
  projects: ProjectModel[]
  isOwner: boolean
  skills: SkillModel[]
  loading?: boolean
}>()

const deleteProject = async (id: string) => {
  const { execute } = useDeleteProject(id)
  await execute()
  emit('deleted', id)
  emit('changed')
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6 mx-3 sm:mx-6">
    <div class="flex justify-between mb-4">
      <h3 class="text-xl font-bold text-black">
        Projects
      </h3>

      <UButton
        v-if="isOwner"
        color="primary"
        class="rounded-full"
        :skills="skills"
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
      v-else
    >
      <div
        v-for="p in projects"
        :key="p._id"
        class="p-4 bg-gray-100 rounded-xl my-3 shadow-sm border border-gray-200"
      >
        <div class="flex justify-between align-baseline items-start">
          <p class="font-bold text-black text-lg">
            {{ p.title }}
          </p>
          <div class="flex justify-end gap-x-3">
            <UButton
              v-if="isOwner"
              color="warning"
              class="w-9 h-9 rounded-full"
              @click="editData = p"
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
              v-if="isOwner"
              color="error"
              class="w-9 h-9 rounded-full"
              @click="deleteProject(p._id)"
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
          {{ p.description }}
        </p>

        <div
          v-if="warningStore.getWarning(p._id)"
          class="mt-3 p-3 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-lg"
        >
          <p>
            {{ warningStore.getWarning(p._id) }}
            <span class="text-red-500 block">
              {{ p.github }}
            </span>
          </p>
        </div>

        <div class="flex gap-2 mt-3 flex-wrap">
          <span
            v-for="(t, i) in p.technologies"
            :key="i"
            class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
          >
            {{ t }}
          </span>
        </div>
      </div>
    </div>

    <AddProjectModal
      v-model="openAdd"
      :skills="skills"
      @created="emit('changed')"
    />
    <EditProjectModal
      v-model="editData"
      @created="emit('changed')"
    />
  </div>
</template>

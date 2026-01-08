<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGetSkillById } from '@@/queries/Profile/student/skill'
import type { SkillModel } from '~/models/skillModel'

const props = defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits(['update:modelValue'])
const open = computed({
  get: () => !!props.modelValue,
  set: v => !v && emit('update:modelValue', null),
})

const skillData = ref<SkillModel | null>(null)
const pending = ref(false)

watch(
  () => props.modelValue,
  async (id) => {
    if (!id) return

    pending.value = true
    const { data } = await useGetSkillById(id)
    skillData.value = data.value?.data ?? null
    pending.value = false
  },
  { immediate: true },
)
</script>

<template>
  <USlideover
    v-model:open="open"
    class="bg-white p-4 shadow-2xl"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <div>
        <h2 class="text-xl font-bold text-black">
          {{ skillData?.name }}
        </h2>
        <p class="text-sm text-primary font-bold capitalize">
          {{ skillData?.level }}
        </p>
      </div>
    </template>

    <template #body>
      <div
        v-if="pending"
        class="flex justify-center py-10"
      >
        <span class="text-gray-500">Loading details...</span>
      </div>

      <div
        v-else-if="skillData"
        class="space-y-6"
      >
        <div>
          <h3 class="font-semibold text-Sequand mb-1">
            Description
          </h3>
          <p class="text-primary">
            {{ skillData.description || 'No description provided.' }}
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-Sequand mb-2">
            Projects
          </h3>

          <div
            v-if="skillData.linkedProjects.length"
            class="space-y-3"
          >
            <div
              v-for="project in skillData.linkedProjects"
              :key="project._id"
              class="border rounded-lg p-3 bg-gray-50"
            >
              <p class="font-bold text-black">
                {{ project.title }}
              </p>
              <p class="text-sm text-gray-600">
                {{ project.description }}
              </p>

              <div class="flex gap-3 mt-2 text-xs">
                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  class="text-primary underline"
                >
                  Live Demo
                </a>
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  class="text-primary underline"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <p
            v-else
            class="text-sm text-gray-400 italic"
          >
            No projects linked.
          </p>
        </div>

        <div>
          <h3 class="font-semibold primary mb-2 text-Sequand">
            Achievements
          </h3>

          <div
            v-if="skillData.linkedAchievements.length"
            class="space-y-3"
          >
            <div
              v-for="achievement in skillData.linkedAchievements"
              :key="achievement._id"
              class="border rounded-lg p-3 bg-gray-50"
            >
              <p class="font-medium text-black">
                {{ achievement.title }}
              </p>
              <p class="text-sm text-gray-600">
                {{ achievement.description }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Date: {{ new Date(achievement.date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <p
            v-else
            class="text-sm text-gray-400 italic"
          >
            No achievements linked.
          </p>
        </div>

        <div>
          <h3 class="font-semibold text-Sequand mb-2">
            Certificates
          </h3>

          <div
            v-if="skillData.linkedCertificates.length"
            class="space-y-3"
          >
            <div
              v-for="certificate in skillData.linkedCertificates"
              :key="certificate._id"
              class="border rounded-lg p-3 bg-gray-50"
            >
              <p class="font-medium text-black">
                {{ certificate.name }}
              </p>
              <p class="text-sm text-gray-600">
                {{ certificate.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

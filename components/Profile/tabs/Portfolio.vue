<script setup lang="ts">
import { useProfile } from '@@/composables/useProfile'
import ProfileSkillProfileSkills from '../skill/ProfileSkills.vue'
import ProfileProjects from '../project/ProfileProjects.vue'
import ProfileAchievement from '../achievement/ProfileAchievement.vue'
import ProfileBadges from '../ProfileBadges.vue'
import Evaluate from './Evaluate.vue'

const { skills, projects, certificates, achievements, badges, isOwner, refresh, isLoading } = useProfile()

const onChanged = async () => {
  await refresh()
}

const onDeleted = async () => {
  await refresh()
}
</script>

<template>
  <div class="mt-6 sm:flex block">
    <div class="sm:max-w-2xl w-full">
      <ProfileSkillProfileSkills
        :skills="skills"
        :projects="projects"
        :certificates="certificates"
        :is-owner="isOwner"
        :loading="isLoading"
        :achievements="achievements"
        @changed="onChanged"
      />
      <ProfileProjects
        :projects="projects"
        :skills="skills"
        :is-owner="isOwner"
        :loading="isLoading"
        @changed="onChanged"
        @deleted="onDeleted"
      />
      <ProfileAchievement
        :achievements="achievements"
        :is-owner="isOwner"
        :loading="isLoading"
        :skills="skills"
        @changed="onChanged"
      />
      <ProfileCourseraList
        :certificates="certificates"
        :is-owner="isOwner"
        :loading="isLoading"
        :skills="skills"
        @changed="onChanged"
      />
      <ProfileBadges
        :badges="badges"
        :is-owner="isOwner"
        :loading="isLoading"
      />
    </div>
    <div class="sm:w-sm w-full my-3">
      <Evaluate
        :is-owner="isOwner"
      />
    </div>
  </div>
</template>

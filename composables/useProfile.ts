import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetFullProfile } from '@@/queries/Profile/student/information'
import { useGlobalStore } from '@@/stores/global'

export function useProfile(userId?: string) {
  const store = useGlobalStore()
  const courseraStore = useCourseraStore()

  let routeId: string | undefined
  try {
    const route = useRoute()
    routeId = (route?.params?.id as string | undefined)
  } catch {
    routeId = undefined
  }

  const resolvedUserId = computed(() => {
    return userId || routeId || store.id
  })

  const { data, refresh, status } = useGetFullProfile(resolvedUserId)

  store.position = data.value?.profile.position ?? null
  const profile = computed(() => data.value?.data.profile ?? null)
  const skills = computed(() => data.value?.data.skills ?? [])
  const projects = computed(() => data.value?.data.projects ?? [])
  const achievements = computed(() => data.value?.data.achievements ?? [])
  const badges = computed(() => data.value?.data.badges ?? [])
  const certificates = computed(() => data.value?.data.courseLinks ?? [])
  watch(
    () => data.value,
    v => {
      if (v?.data) {
        courseraStore.setCertificates(v.data.courseLinks ?? [])
      }
    },
    { immediate: true },
  )

  const isOwner = computed(() => resolvedUserId.value === store.id)
  const isLoading = computed(() => status.value === 'pending')

  return {
    profile,
    skills,
    projects,
    achievements,
    badges,
    certificates,
    isOwner,
    isLoading,
    refresh,
    userId: resolvedUserId,
  }
}

import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGetFullProfile } from '@@/queries/Profile/student/information'
import { useGlobalStore } from '@@/stores/global'
import type { ProfessorProfileData } from '~/models/profileInformationModel'

export function useProfessorProfile(userId?: string) {
  const store = useGlobalStore()
  const route = useRoute()

  const resolvedUserId = computed(() => {
    if (userId) return userId
    if (route.params.id) return route.params.id as string
    if (route.query.id) return route.query.id as string

    return store.id
  })

  const profile = ref<ProfessorProfileData | null>(null)
  const imageVersion = ref(Date.now())

  const { data, refresh, status } = useGetFullProfile(resolvedUserId)

  watch(
    () => data.value,
    (v) => {
      if (!v?.data) return

      if (v.data.profile?.user?.role === 'professor') {
        profile.value = v.data as ProfessorProfileData
        imageVersion.value = Date.now()
      }
    },
    { immediate: true },
  )

  const isOwner = computed(() =>
    profile.value?.profile.user._id === store.id,
  )

  return {
    profile,
    isOwner,
    isLoading: computed(() => status.value === 'pending'),
    imageVersion,
    refresh,
  }
}

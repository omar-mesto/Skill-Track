import { ref, watch } from 'vue'
import { useGetProfileInformation } from '@@/queries/Profile/student/information'
import type { ProfileResponse } from '@@/models/profileInformationModel'

export function useProfile() {
  const { data, refresh } = useGetProfileInformation()

  const profile = ref<ProfileResponse['data'] | null>(null)

 watch(
  data,
  () => {
    profile.value = data.value?.data || null
  },
  { immediate: true },
)

  return {
    profile,
    refresh,
  }
}

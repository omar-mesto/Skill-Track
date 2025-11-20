import { ref, watch } from 'vue'
import type { professorProfileResponse } from '@@/models/profileInformationModel'
import { useGetProfessorProfileInformation } from '@@/queries/Profile/professor/information'

export function useCompanyProfile() {
  const { data, refresh } = useGetProfessorProfileInformation()

  const profile = ref<professorProfileResponse['data'] | null>(null)

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

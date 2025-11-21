import { ref, watch } from 'vue'
import type { ProfessorProfileResponse } from '@@/models/profileInformationModel'
import { useGetProfessorProfileInformation } from '@@/queries/Profile/professor/information'

export function useProfessorProfile() {
  const { data, refresh } = useGetProfessorProfileInformation()

  const profile = ref<ProfessorProfileResponse['data'] | null>(null)

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

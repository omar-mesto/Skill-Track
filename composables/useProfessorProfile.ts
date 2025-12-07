import { computed } from 'vue'
import type { ProfessorProfileResponse } from '@@/models/profileInformationModel'
import { useGetProfessorProfileInformation } from '@@/queries/Profile/professor/information'

export function useProfessorProfile() {
  const { data, refresh } = useGetProfessorProfileInformation()

  const profile = computed<ProfessorProfileResponse['data'] | null>(() => {
    return data.value?.data || null
  })

  return {
    profile,
    refresh,
  }
}

import { ref, watch } from 'vue'
import type { companyProfileResponse } from '@@/models/profileInformationModel'
import { useGetCompanyProfileInformation } from '@@/queries/Profile/company/information'

export function useCompanyProfile() {
  const { data, refresh } = useGetCompanyProfileInformation()

  const profile = ref<companyProfileResponse['data'] | null>(null)

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

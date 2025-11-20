import { useAPI } from '@@/services/baseApi'
import type { companyProfileResponse } from '@@/models/profileInformationModel'

export const useGetCompanyProfileInformation = () => {
  return useAPI<companyProfileResponse>({
    url: '/profile/company/get',
    type: 'GET',
    queryKey: 'profile-information',
  })
}

export const useUpdateCompanyProfile = (payload: FormData) => {
  return useAPI({
    url: '/profile/company/update',
    payload,
    type: 'PUT',
    queryKey: 'company-information',
  })
}

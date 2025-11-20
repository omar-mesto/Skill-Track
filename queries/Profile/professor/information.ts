import { useAPI } from '@@/services/baseApi'
import type { ProfessorProfileResponse } from '@@/models/profileInformationModel'

export const useGetProfessorProfileInformation = () => {
  return useAPI<ProfessorProfileResponse>({
    url: '/profile/professor/get',
    type: 'GET',
    queryKey: 'professor-information',
  })
}

export const useUpdateProfessorProfile = (payload: FormData) => {
  return useAPI({
    url: '/profile/professor/update',
    payload,
    type: 'PUT',
    queryKey: 'professor-information',
  })
}

import { useAPI } from '@@/services/baseApi'
import type { ProfileResponse, UpdateProfileDto } from '@@/models/profileInformationModel'

export const useGetProfileInformation = () => {
  return useAPI<ProfileResponse>({
    url: '/profile',
    type: 'GET',
    queryKey: 'profile-information',
  })
}

export const useUpdateProfile = (payload: FormData) => {
  return useAPI({
    url: '/profile/updateProfile',
    payload,
    type: 'PUT',
    queryKey: 'profile-information',
  })
}

import { useAPI } from '@@/services/baseApi'
import type { ProfileResponse } from '@@/models/profileInformationModel'
import type { FullProfileResponse } from '@@/models/profileModel'
import type { ProfileQRResponse } from '~/models/profileQrModel'

type RequestStatus = 'idle' | 'pending' | 'success' | 'error'

export const useGetProfileInformation = (userId?: string) => {
  const url = userId
    ? `/profile/users/${userId}`
    : '/profile'

  return useAPI<ProfileResponse>({
    url,
    type: 'GET',
    queryKey: userId ? `profile-${userId}` : 'profile',
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

export const useGetProfileQR = () => {
  return useAPI<ProfileQRResponse>({
    url: '/profile/myProfile/qr',
    type: 'GET',
    queryKey: 'profile-qr',
  })
}

export const useGetFullProfile = (userId: string | Ref<string>) => {
  const data = ref<FullProfileResponse | null>(null)
  const status = ref<RequestStatus>('idle')

  const fetchProfile = async (id: string) => {
    if (!id) return

    status.value = 'pending'

    const res = await useAPI<FullProfileResponse>({
      url: `/profile/users/${id}`,
      type: 'GET',
      queryKey: `profile-${id}`,
    })

    data.value = res.data.value ?? null
    status.value = res.status.value as RequestStatus
  }

  watch(
    () => unref(userId),
    (id) => {
      if (id) fetchProfile(id)
    },
    { immediate: true },
  )

  const refresh = async () => {
    const id = unref(userId)
    if (id) await fetchProfile(id)
  }

  return {
    data,
    status,
    refresh,
  }
}

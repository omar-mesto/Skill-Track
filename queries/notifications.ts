import { useAPI } from '@@/services/baseApi'

export const useSaveFcmToken = (token: string) => {
  return useAPI({
    url: '/auth/notifications/fcm-token',
    type: 'POST',
    payload: { fcmToken: token },
    queryKey: 'save-fcm-token',
  })
}

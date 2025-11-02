import { useAPI } from '@@/services/baseApi'
import type { loginModel } from '~/models/loginModel'

export const useLoginAdmin = (user: loginModel) => {
  return useAPI({ url: '/auth/admin/login', payload: user, queryKey: 'user', type: 'POST' })
}

export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'user', type: 'POST' })
}

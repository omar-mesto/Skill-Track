import { useAPI } from '@@/services/baseApi'
import type { loginModel } from '~/models/loginModel'

export const useLoginAdmin = (user: loginModel) => {
  return useAPI({ url: '/auth/admin/login', payload: user, queryKey: 'admin', type: 'POST' })
}

export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'admin', type: 'POST' })
}

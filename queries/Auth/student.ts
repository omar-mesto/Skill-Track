import { useAPI } from '@@/services/baseApi'
import type { loginModel } from '~/models/loginModel'

export const useLoginStudent = (user: loginModel) => {
  return useAPI({ url: '/auth/login', payload: user, queryKey: 'user', type: 'POST' })
}

export const useRegisterStudent = (user: loginModel) => {
  return useAPI({ url: '/auth/register', payload: user, queryKey: 'user', type: 'POST' })
}

export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'user', type: 'POST' })
}

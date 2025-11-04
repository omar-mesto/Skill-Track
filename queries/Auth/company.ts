import { useAPI } from '@@/services/baseApi'
import type { loginModel } from '~/models/loginModel'

export const useLoginCompany = (user: loginModel) => {
  return useAPI({ url: '/auth/company/login', payload: user, queryKey: 'company', type: 'POST' })
}

export const useRegisterProfessor = (user: loginModel) => {
  return useAPI({ url: '/auth/company/register', payload: user, queryKey: 'company', type: 'POST' })
}

export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'company', type: 'POST' })
}

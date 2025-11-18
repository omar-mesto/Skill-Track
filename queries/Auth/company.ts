import { useAPI } from '@@/services/baseApi'
import type { loginModel } from '~/models/loginModel'

export const useLoginCompany = (user: loginModel) => {
  return useAPI({ url: '/auth/company/login', payload: user, queryKey: 'company', type: 'POST' })
}

export const useRegisterCompany = (formData: FormData) => {
  return useAPI({
    url: '/auth/company/register',
    payload: formData,
    queryKey: 'company-register',
    type: 'POST',
    isLazy: true,
  })
}

export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'company', type: 'POST' })
}

import { useAPI } from '@@/services/baseApi'
import type { loginModel } from '~/models/loginModel'

export const useLoginProfessor = (user: loginModel) => {
  return useAPI({ url: '/auth/professor/login', payload: user, queryKey: 'professor', type: 'POST' })
}

export const useRegisterProfessor = (formData: FormData) => {
  return useAPI({
    url: '/auth/professor/register',
    payload: formData,
    queryKey: 'professor',
    type: 'POST',
    isLazy: true,
  })
}
export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'professor', type: 'POST' })
}

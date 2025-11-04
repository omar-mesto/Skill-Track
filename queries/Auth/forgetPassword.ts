import { useAPI } from '@@/services/baseApi'
import type { forgetPasswordModel } from '~/models/forgetPasswordModel'
import type { loginModel } from '~/models/loginModel'

export const useforgetPassword = (user: forgetPasswordModel) => {
    return useAPI({ url: '/otp/forgotPassword', payload: user, queryKey: 'forgetPassword', type: 'POST' })
}

export const useVerifyOTP = (user: loginModel) => {
    return useAPI({
      url: '/otp/verifyOTP',
      payload: user,
      queryKey: 'VerifyOTP',
      type: 'POST',
    })
}

export const useUpdatePassword = (user: loginModel) => {
    return useAPI({
      url: '/otp/resetPassword',
      payload: user,
      queryKey: 'UpdatePassword',
      type: 'POST',
    })
}

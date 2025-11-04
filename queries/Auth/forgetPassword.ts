import { useAPI } from '@@/services/baseApi'
import type { forgetPasswordModel } from '~/models/forgetPasswordModel'
import type { VerifyOTPModel } from '~/models/verifyOTPModel'

export const useforgetPassword = (user: forgetPasswordModel) => {
    return useAPI({ url: '/otp/forgotPassword', payload: user, queryKey: 'forgetPassword', type: 'POST' })
}

export const useVerifyOTP = (payload: VerifyOTPModel) => {
    return useAPI({
      url: '/otp/verifyOTP',
      payload: payload,
      queryKey: 'VerifyOTP',
      type: 'POST',
    })
}

export const useUpdatePassword = (user: unknown) => {
    return useAPI({
      url: '/otp/resetPassword',
      payload: user as undefined,
      queryKey: 'UpdatePassword',
      type: 'POST',
    })
}

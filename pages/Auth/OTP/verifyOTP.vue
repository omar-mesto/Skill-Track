<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@@/stores/global'
import { useVerifyOTP } from '@@/queries/Auth/forgetPassword'
import type { VerifyOTPModel } from '@@/models/verifyOTPModel'
import { verifyOTPSchema } from '@@/schema/verifyOTPSchema'
import { useToast } from '#imports'
import type { otpModel } from '~/models/otpModel'

const otpForm = ref({
  otp: ['', '', '', '', '', ''],
})

const otpString = computed(() => otpForm.value.otp.join(''))
const formIsValid = computed(() => otpForm.value.otp.some(digit => !digit))

const toast = useToast()
const router = useRouter()
const globalStore = useGlobalStore()

const isLoading = ref(false)

const handleSubmit = async () => {
  if (formIsValid.value) {
    toast.add({ description: 'Please enter the complete OTP', color: 'error', class: 'text-black' })

    return
  }

  isLoading.value = true

  const payload: VerifyOTPModel = {
    code: otpString.value,
    email: globalStore.email,
  }

  const { execute, status, error, data } = useVerifyOTP(payload)
  await execute()

  if (status.value === 'success') {
    const globalStore = useGlobalStore()
    const otpData = data.value as otpModel
    globalStore.resetToken = otpData.data.resetToken
    toast.add({ description: 'OTP verified successfully', color: 'success', class: 'text-black' })
    router.push('/auth/otp/resetPassword')
  } else {
    toast.add({ description: error.value?.data?.message, color: 'error', class: 'text-black' })
  }

  isLoading.value = false
}
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="flex-1 bg-primary flex items-center justify-center relative overflow-hidden">
      <img
        src="../../../public/otp.png"
      >
    </div>
    <div class="flex-1 bg-[#f2f2f2] flex items-center justify-center">
      <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl py-5 px-6 space-y-6">
        <div class="text-center">
          <p class="text-lg md:text-3xl font-bold text-black mb-6">
            Verify OTP
          </p>
          <p class="text-[#868686] py-3">
            Enter your OTP that we Send to
            <span class="font-bold text-primary cursor-pointer">
              {{ globalStore.email }}
            </span>
          </p>
        </div>
        <UForm
          ref="form"
          action="#"
          :schema="verifyOTPSchema"
          class="space-y-4 text-center"
          @submit.prevent="navigateTo('/admin/auth/forgetPassword')"
        >
          <UPinInput
            v-model="otpForm.otp"
            otp
            color="primary"
            size="xl"
            :length="6"
          />
          <p
            class="text-end text-Sequand underline cursor-pointer font-bold"
            @click="navigateTo('/auth/OTP')"
          >
            Resend OTP
          </p>
          <UButton
            type="submit"
            block
            class="w-full sm:mt-3 disabled:bg-primary text-white bg-primary hover:bg-blue-950 rounded-full h-12 py-2.5 font-bold text-center"
            @click="handleSubmit"
          >
            <span class="font-bold text-lg">Sign in</span>
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

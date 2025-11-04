<script lang="ts" setup>
import { useforgetPassword } from '@@/queries/Auth/forgetPassword'
import { useGlobalStore } from '@@/stores/global'
import { forgetPasswordSchema } from '@@/schema/forgetPasswordSchema'

const forgetPasswordForm = ref({
  email: '',
})
const isLoading = ref(false)
const toast = useToast()
const router = useRouter()

const forgetPassword = async () => {
  isLoading.value = true
  const { status } = await useforgetPassword(forgetPasswordForm.value)
  if (status.value == 'success') {
    toast.add({ description: 'OTP sent successfully', color: 'success' })
    const globalStore = useGlobalStore()
    globalStore.email = forgetPasswordForm.value.email

    await router.push('/auth/otp/verifyOTP')
  }
  else {
    toast.add({ description: 'No account found with this email', color: 'error' })
  }
    isLoading.value = false
}
</script>

<template>
  <div class="flex flex-col sm:flex-row h-screen w-full">
    <div class="flex-1 bg-white flex items-center justify-center px-6 py-10">
      <div class="w-full max-w-md px-6 space-y-6">
        <div class="text-center">
          <p class="text-lg md:text-3xl font-bold text-black mt-16">
            Forget Password
          </p>
          <p class="text-[#868686] pt-3">
            Enter our Email to Send OTP
          </p>
        </div>
        <UForm
          ref="form"
          :state="forgetPasswordForm"
          action="#"
          :schema="forgetPasswordSchema"
          class="space-y-4"
          @submit="forgetPassword"
        >
          <UFormField
            class="text-primary"
            label="Email"
            name="email"
          >
            <UInput
              v-model="forgetPasswordForm.email"
              class="border-0 rounded-lg bg-white text-black block"
              size="xl"
              variant="subtle"
            />
          </UFormField>
          <UButton
            :loading="isLoading"
            type="submit"
            block
            class="w-full sm:mt-3 disabled:bg-primary hover:cursor-pointer text-white bg-primary hover:bg-blue-950 rounded-full h-12 py-2.5 font-bold text-center"
          >
            <span class="font-bold text-lg">Submit</span>
          </UButton>
        </UForm>
      </div>
    </div>
    <div class="hidden sm:flex flex-1 bg-primary items-center justify-center relative overflow-hidden">
      <img
        src="../../../public/ForgotPassword.png"
      >
    </div>
  </div>
</template>

<style scoped>

</style>

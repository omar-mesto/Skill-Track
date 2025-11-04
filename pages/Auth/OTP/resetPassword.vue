<script lang="ts" setup>
import { useUpdatePassword } from '@@/queries/Auth/forgetPassword'
import { updatePasswordSchema } from '@@/schema/updatePasswordSchema'

const updatePasswordForm = ref({
  newPassword: '',
})
const isLoading = ref(false)
const toast = useToast()
const router = useRouter()
const globalStore = useGlobalStore()

const updatePassword = async () => {
  isLoading.value = true
  const payload = {
    resetToken: globalStore.resetToken,
    newPassword: updatePasswordForm.value.newPassword,
  }
  const { status, error } = await useUpdatePassword(payload)
  if (status.value == 'success') {
    toast.add({
      description: 'Password updated successfully.',
      color: 'success',
      class: 'text-black',
    })
    await router.push('/')
  } else {
    toast.add({
      description: error.value?.data?.message,
      color: 'error',
      class: 'text-black',
    })
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
            Update Password
          </p>
          <p class="text-[#868686] pt-3">
            Enter your New Password
          </p>
        </div>
        <UForm
          ref="form"
          action="#"
          :schema="updatePasswordSchema"
          class="space-y-4"
          :state="updatePasswordForm"
          @submit="updatePassword"
        >
          <UFormField
            class="text-primary"
            label="New Password"
            name="newPassword"
          >
            <UInput
              v-model="updatePasswordForm.newPassword"
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

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useErrorStore } from '@@/stores/error'
import { useGlobalStore } from '@@/stores/global'
import { useRegisterStudent } from '@@/queries/Auth/student'
import { registerSchema } from '@@/schema/registerUser'
import type { RegisterResponse } from '~/models/registerModel'

const router = useRouter()

const userForm = ref({
  name: '',
  email: '',
  password: '',
  avatar: null as File | null,
  coverImage: null as File | null,
})

const form = ref()
const errorStore = useErrorStore()
const toast = useToast()
const isLoading = ref(false)

const formIsValid = computed(() => {
  if (!form.value) return true

return form.value.errors && Object.keys(form.value.errors).length > 0
})

const handleAvatar = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) userForm.value.avatar = file
}

const handleCover = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) userForm.value.coverImage = file
}

const registerUser = async () => {
  isLoading.value = true

  const formData = new FormData()
  formData.append('name', userForm.value.name)
  formData.append('email', userForm.value.email)
  formData.append('password', userForm.value.password)
  if (userForm.value.avatar) formData.append('avatar', userForm.value.avatar)
  if (userForm.value.coverImage) formData.append('coverImage', userForm.value.coverImage)

  const { data, status } = await useRegisterStudent(formData)

  if (status.value === 'success') {
    const loginData = data.value as RegisterResponse

    const globalStore = useGlobalStore()
    globalStore.token = loginData.data.token
    globalStore.role = loginData.data.role
    globalStore.name = loginData.data.name
    globalStore.email = loginData.data.email

    toast.add({
      description: 'Account created successfully!',
      color: 'success',
      ui: { root: 'bg-white text-black shadow-md' },
    })

    router.push('/')
  } else {
    toast.add({
      description: errorStore.message as string,
      color: 'error',
      ui: { root: 'bg-white text-black shadow-md' },
    })
  }

  isLoading.value = false
}
</script>

<template>
  <div class="w-full bg-white text-black h-screen flex flex-col md:flex-row">
    <div class="w-1/2 bg-primary md:grid hidden h-screen place-items-center">
      <img
        src="/StudentLogin.png"
        class="w-full md:w-xl"
      >
    </div>

    <div class="w-full md:w-1/2 h-full grid place-items-center">
      <div class="flex w-full flex-col items-center px-6">
        <p class="text-lg md:text-3xl font-bold text-black mt-16">
          Student Register
        </p>
        <p class="text-[#868686] pt-3">
          Create your Account
        </p>

        <div class="w-full md:px-1 lg:px-20">
          <div class="md:p-6 md:space-y-6 sm:p-8">
            <UForm
              ref="form"
              :schema="registerSchema"
              :state="userForm"
              class="sm:space-y-4 lg:space-y-0"
              @submit="registerUser"
            >
              <UFormField
                label="Name"
                name="name"
                class="mx-auto text-center grid"
              >
                <UInput
                  v-model="userForm.name"
                  class="border-0 rounded-lg bg-white text-black block"
                  size="xl"
                  variant="subtle"
                />
              </UFormField>

              <UFormField
                label="Email"
                name="email"
                class="my-2"
              >
                <UInput
                  v-model="userForm.email"
                  class="border-0 rounded-lg bg-white text-black block"
                  size="xl"
                  variant="subtle"
                />
              </UFormField>

              <UFormField
                label="Password"
                name="password"
              >
                <UInput
                  v-model="userForm.password"
                  type="password"
                  class="border-0 rounded-lg bg-white text-black block"
                  size="xl"
                  variant="subtle"
                />
              </UFormField>

              <UFormField
                label="Avatar"
                class="my-2"
              >
                <input
                  type="file"
                  accept="image/*"
                  class="border-2 rounded-md w-full p-2 bg-white text-black block"
                  size="xl"
                  variant="subtle"
                  @change="handleAvatar"
                >
              </UFormField>

              <UFormField label="Cover Image">
                <input
                  type="file"
                  accept="image/*"
                  class="border-2 w-full rounded-md p-2 bg-white text-black block"
                  size="xl"
                  variant="subtle"
                  block
                  @change="handleCover"
                >
              </UFormField>

              <UButton
                :loading="isLoading"
                :disabled="formIsValid"
                type="submit"
                block
                class="w-full mt-5 bg-primary text-white hover:bg-blue-950 rounded-full h-12 font-bold"
              >
                Register
              </UButton>

              <p class="text-center mt-5">
                Already have account?
                <span
                  class="text-Sequand underline cursor-pointer font-bold"
                  @click="navigateTo('/Auth/Student')"
                >
                  Sign in
                </span>
              </p>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

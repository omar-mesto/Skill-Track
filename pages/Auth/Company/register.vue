<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useErrorStore } from '@@/stores/error'
import { useGlobalStore } from '@@/stores/global'
import { useRegisterCompany } from '@@/queries/Auth/company'
import { registerCompanySchema } from '@@/schema/registerCompany'
import type { RegisterResponse } from '~/models/registerModel'
import { UTextarea } from '#components'

const router = useRouter()

const companyFrom = ref({
  name: '',
  email: '',
  licenseImage: null as File | null,
  password: '',
  avatar: null as File | null,
  coverImage: null as File | null,
  companyName: '',
  bio: '',
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
  if (file) companyFrom.value.avatar = file
}

const handleCover = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) companyFrom.value.coverImage = file
}

const handleLicense = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) companyFrom.value.licenseImage = file
}

const registerUser = async () => {
  isLoading.value = true

  const formData = new FormData()
  formData.append('name', companyFrom.value.name)
  formData.append('email', companyFrom.value.email)
  formData.append('password', companyFrom.value.password)
  formData.append('bio', companyFrom.value.bio)
  formData.append('companyName', companyFrom.value.companyName)
  if (companyFrom.value.avatar) formData.append('avatar', companyFrom.value.avatar)
  if (companyFrom.value.coverImage) formData.append('coverImage', companyFrom.value.coverImage)
  if (companyFrom.value.licenseImage) formData.append('licenseImage', companyFrom.value.licenseImage)

  const { data, status } = await useRegisterCompany(formData)

  if (status.value === 'success') {
    const loginData = data.value as RegisterResponse

    const globalStore = useGlobalStore()
    globalStore.token = loginData.data.token
    globalStore.role = loginData.data.role
    globalStore.name = loginData.data.name
    globalStore.email = loginData.data.email
    globalStore.id = loginData.data.id

    toast.add({
      description: 'Account created successfully!',
      color: 'success',
      ui: { root: 'bg-white text-black shadow-md' },
    })

    router.push('./')
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
        src="/ProfessorLogin.png"
        class="w-full md:w-xl"
      >
    </div>

    <div class="w-full md:w-1/2 h-full grid place-items-center">
      <div class="flex w-full flex-col items-center px-6">
        <p class="text-lg md:text-3xl font-bold text-black mt-3">
          Company Register
        </p>

        <div class="w-full md:px-1 lg:px-20">
          <div class="md:p-6 md:space-y-6 sm:p-8">
            <UForm
              ref="form"
              :schema="registerCompanySchema"
              :state="companyFrom"
              class="sm:space-y-4 lg:space-y-0"
              @submit="registerUser"
            >
              <div class="flex justify-between">
                <UFormField
                  label="Name"
                  name="name"
                >
                  <UInput
                    v-model="companyFrom.name"
                    class="border-0 rounded-lg bg-white text-black block"
                    size="xl"
                    variant="subtle"
                  />
                </UFormField>

                <UFormField
                  label="Company Name"
                  name="companyName"
                >
                  <UInput
                    v-model="companyFrom.companyName"
                    class="border-0 rounded-lg bg-white text-black block"
                    size="xl"
                    variant="subtle"
                  />
                </UFormField>
              </div>

              <div class="flex my-2 justify-between">
                <UFormField
                  label="Email"
                  name="email"
                >
                  <UInput
                    v-model="companyFrom.email"
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
                    v-model="companyFrom.password"
                    type="password"
                    class="border-0 rounded-lg bg-white text-black block"
                    size="xl"
                    variant="subtle"
                  />
                </UFormField>
              </div>

              <UFormField
                label="Bio"
                name="bio"
              >
                <UTextarea
                  v-model="companyFrom.bio"
                  type="password"
                  class=" rounded-lg bg-white text-black block"
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

              <UFormField
                label="Cover Image"
                class="my-2"
              >
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
              <UFormField label="Company License">
                <input
                  type="file"
                  accept="image/*"
                  class="border-2 w-full rounded-md p-2 bg-white text-black"
                  @change="handleLicense"
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
                  @click="navigateTo('/Auth/Company')"
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

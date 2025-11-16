<script lang="ts" setup>
import { useLoginAdmin } from '@@/queries/Auth/admin'
import type { LoginResponse } from '@@/models/loginResponseModel'
import type { loginModel } from '~/models/loginModel'

const router = useRouter()

const adminLoginFunction = async (userData: loginModel) => {
  const { data, status } = await useLoginAdmin(userData)
  if (status.value === 'success') {
    const loginData = data.value as LoginResponse
    router.push('/Dashbaord')

    return { success: true, role: 'Admin', token: loginData.data.token, name: loginData.data.user.name, email: loginData.data.user.email }
  } else {
    return { success: false }
  }
}
</script>

<template>
  <div class="w-full bg-white text-black h-dvh flex flex-col md:flex-row">
    <Auth :login-function="adminLoginFunction">
      <p class="text-lg md:text-3xl font-bold text-black mt-16">
        Admin Login
      </p>
      <p class="text-[#868686] pt-3">
        Enter your Email and Password
      </p>
      <template #button>
        <NuxtLink class="font-bold cursor-pointer text-primary hover:underline">
          Sign in
        </NuxtLink>
      </template>
    </Auth>
    <div class="w-1/2 bg-primary md:grid hidden h-screen place-items-center">
      <img
        src="../../../public/AdminLogin.png"
        loading="lazy"
        class="w-full md:w-xl"
      >
    </div>
  </div>
</template>

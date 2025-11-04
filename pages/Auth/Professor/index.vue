<script lang="ts" setup>
import { useLoginProfessor } from '@@/queries/Auth/professor'
import type { loginModel } from '@@/models/loginModel'
import type { LoginResponse } from '@@/models/loginResponseModel'

const router = useRouter()

const professorLoginFunction = async (userData: loginModel) => {
  const { data, status } = await useLoginProfessor(userData)
  if (status.value === 'success') {
    const loginData = data.value as LoginResponse
    router.push('/')

    return { success: true, role: loginData.data.user.role, token: loginData.data.token, name: loginData.data.user.name, email: loginData.data.user.email }
  } else {
    return { success: false }
  }
}
</script>

<template>
  <div class="w-full bg-white text-black h-dvh flex flex-col md:flex-row">
    <Auth :login-function="professorLoginFunction">
      <p class="text-lg md:text-3xl font-bold text-black mt-16">
        Professor Login
      </p>
      <p class="text-[#868686] pt-3">
        Enter your Email and Password
      </p>
      <template #button>
        <NuxtLink class="font-bold cursor-pointer text-primary hover:underline">
          Sign in
        </NuxtLink>
      </template>
      <template #Register>
        <p
          class="text-center pt-5"
        >
          You Do Not Have Account?
          <span
            class="text-Sequand underline mx-1 cursor-pointer font-bold"
            @click="navigateTo('/Auth/Professor/Register')"
          >Sign Up</span>
        </p>
      </template>
    </Auth>
    <div class="w-1/2 bg-primary md:grid hidden h-screen place-items-center">
      <img
        src="../../../public/ProfessorLogin.png"
        loading="lazy"
        class="w-full md:w-xl"
      >
    </div>
  </div>
</template>

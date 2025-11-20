<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGetProfileInformation } from '@@/queries/Profile/student/information'
import EditProfileModal from '@@/components/Profile/updateProfileInformation.vue'
import { useLogout } from '@@/queries/Auth/admin'

const store = useGlobalStore()
const showLogoutConfirm = ref(false)
const showEdit = ref(false)
const router = useRouter()

const { data, refresh } = useGetProfileInformation()
const profile = computed(() => data.value?.data || null)

const { execute: logoutExecute, status: logoutStatus } = useLogout()

const confirmLogout = async () => {
  await logoutExecute()
  if (logoutStatus.value === 'success') {
    store.logout()
    showLogoutConfirm.value = false
    router.push('/')
  }
}
</script>

<template>
  <div class="sm:mt-16 mt-10 px-4 sm:px-6 md:px-8">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold text-gray-900">
          {{ profile?.fullName }}
        </h2>

        <p class="text-lg text-secondary">
          {{ profile?.postion || 'No Position' }}
        </p>

        <p class="text-primary font-bold text-lg">
          {{ profile?.university || 'No University' }}
        </p>

        <p class="text-gray-700">
          {{ profile?.user.email }}
        </p>

        <p class="text-gray-600 mt-2">
          {{ profile?.bio || 'No bio available' }}
        </p>

        <div class="text-gray-500 text-sm px-2">
          {{ profile?.phone || 'No phone' }}
        </div>

        <div class="text-gray-500 text-sm px-2">
          {{ profile?.address || 'No address' }}
        </div>
      </div>

      <div class="flex gap-x-3">
        <UButton
          color="primary"
          class="rounded-full w-fit"
          @click="showEdit = true"
        >
          Edit Profile
        </UButton>
        <UButton
          class="rounded-full bg-red-500 hover:bg-red-700 hover:cursor-pointer w-fit"
          @click="showLogoutConfirm = true"
        >
          Logout
        </UButton>
      </div>
    </div>

    <UModal
      v-model:open="showLogoutConfirm"
      class="bg-white text-black"
      :ui="{ footer: 'justify-end' }"
    >
      <template #title>
        <p class="text-black font-semibold">
          Logout Confirmation
        </p>
      </template>
      <template #body>
        <p>Are you sure you want to log out?</p>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <UButton
            variant="ghost"
            @click="showLogoutConfirm = false"
          >
            Cancel
          </UButton>
          <UButton
            class="bg-red-500 hover:bg-red-600 hover:text-white"
            @click="confirmLogout"
          >
            Logout
          </UButton>
        </div>
      </template>
    </UModal>

    <EditProfileModal
      v-model="showEdit"
      :profile="profile"
      @updated="refresh()"
    />
  </div>
</template>

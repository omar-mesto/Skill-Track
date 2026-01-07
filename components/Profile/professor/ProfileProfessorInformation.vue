<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGetProfileQR } from '@@/queries/Profile/student/information'
import { useLogout } from '@@/queries/Auth/admin'
import UpdateProfessorProfileInformation from './updateProfessorProfileInformation.vue'
import type { ProfessorProfileData } from '~/models/profileInformationModel'

const props = defineProps<{
  profile: ProfessorProfileData | null
  isOwner: boolean
}>()

const user = computed(() => props.profile?.profile.user)
const professorExtra = computed(() => props.profile?.professorExtra)

const emit = defineEmits(['updated'])

const showEdit = ref(false)
const showQrModal = ref(false)
const { data: qrResponse, refresh: fetchQr } = useGetProfileQR()
const qrData = computed(() => qrResponse.value?.data || null)

watch(showQrModal, (v) => {
  if (v && props.isOwner) fetchQr()
})

const copyProfileUrl = async () => {
  if (!qrData.value?.profileUrl) return
  await navigator.clipboard.writeText(qrData.value.profileUrl)

  useToast().add({
    description: 'Profile link copied successfully',
    color: 'success',
    class: 'text-black bg-white',
  })
}

const router = useRouter()
const showLogoutConfirm = ref(false)
const confirmLogout = async () => {
  const { execute: logoutExecute, status: logoutStatus } = useLogout()
  await logoutExecute()

  if (logoutStatus.value === 'success') {
    useGlobalStore().logout()
    showLogoutConfirm.value = false
    router.push('/')
  }
}
</script>

<template>
  <div class="flex justify-end gap-3 mb-4 mt-8 sm:mt-0">
    <UButton
      v-if="isOwner"
      color="secondary"
      variant="outline"
      class="rounded-full flex items-center gap-2"
      @click="showQrModal = true"
    >
      <UIcon
        name="i-heroicons-qr-code"
        class="w-5 h-5"
      />
      Share
    </UButton>

    <UButton
      v-if="isOwner"
      color="primary"
      @click="showEdit = true"
    >
      Edit Profile
    </UButton>
    <UButton
      v-if="isOwner"
      class="rounded-full hover:bg-red-700"
      @click="showLogoutConfirm = true"
    >
      Logout
    </UButton>
  </div>
  <h2 class="text-2xl font-bold text-black">
    {{ user?.name }}
  </h2>

  <p class="text-gray-600">
    {{ user?.email }}
  </p>

  <p class="text-gray-600">
    {{ professorExtra?.specialization || 'No specialization' }}
  </p>

  <p class="text-gray-600">
    {{ professorExtra?.bio || 'No bio' }}
  </p>

  <UModal
    v-model:open="showQrModal"
    class="bg-white text-black mx-auto"
  >
    <template #title>
      <p class="text-black">
        Share Profile
      </p>
    </template>
    <template #body>
      <img
        v-if="qrData?.qrCode"
        :src="qrData.qrCode"
        class="w-48 h-48 mx-auto"
      >
      <div class="text-center">
        <button
          v-if="qrData?.profileUrl"
          class="text-primary underline mx-auto text-sm"
          @click="copyProfileUrl"
        >
          {{ qrData.profileUrl }}
        </button>
      </div>
    </template>
  </UModal>
  <UModal
    v-model:open="showLogoutConfirm"
    class="bg-white text-black"
  >
    <template #title>
      <p class="text-black font-semibold">
        Logout Confirmation
      </p>
    </template>

    <template #body>
      Are you sure you want to log out?
    </template>

    <template #footer>
      <div class="flex w-full text-white justify-end gap-2">
        <UButton @click="showLogoutConfirm = false">
          Cancel
        </UButton>
        <UButton
          color="error"
          @click="confirmLogout"
        >
          Logout
        </UButton>
      </div>
    </template>
  </UModal>

  <UpdateProfessorProfileInformation
    v-model="showEdit"
    :profile="props.profile"
    @updated="emit('updated')"
  />
</template>

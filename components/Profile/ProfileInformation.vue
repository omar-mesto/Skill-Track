<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGetProfileQR } from '@@/queries/Profile/student/information'
import EditProfileModal from '@@/components/Profile/updateProfileInformation.vue'
import { useLogout } from '@@/queries/Auth/admin'
import { useProfile } from '@@/composables/useProfile'
import { useFollowUser } from '@@/queries/follow'

// ===============================
// Props
// ===============================
const props = defineProps<{
  currentUser?: {
    _id?: string
    role?: string
  }
  readonly?: boolean
}>()

// ===============================
// Emits
// ===============================
const emit = defineEmits(['openSidebar', 'updated'])

// ===============================
// Stores & Router
// ===============================
const store = useGlobalStore()
const courseraStore = useCourseraStore()
const router = useRouter()

// ===============================
// Profile (صاحب الصفحة)
// ===============================
const { profile, refresh, isOwner } = useProfile()

// ===============================
// Logout
// ===============================
const showLogoutConfirm = ref(false)
const { execute: logoutExecute, status: logoutStatus } = useLogout()

const confirmLogout = async () => {
  await logoutExecute()
  if (logoutStatus.value === 'success') {
    store.logout()
    showLogoutConfirm.value = false
    router.push('/')
    courseraStore.clearCertificates()
  }
}

// ===============================
// Edit profile
// ===============================
const showEdit = ref(false)

// ===============================
// QR Code
// ===============================
const showQrModal = ref(false)
const { data: qrResponse, refresh: fetchQr } = useGetProfileQR()
const qrData = computed(() => qrResponse.value?.data || null)

watch(showQrModal, (v) => {
  if (v && isOwner.value) fetchQr()
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

// ===============================
// Bio
// ===============================
const bio = computed(() =>
  profile.value?.bio
    ? profile.value.bio.replace(/\s+/g, ' ').trim()
    : 'No bio available',
)

// ===============================
// Users
// ===============================

// صاحب صفحة البروفايل
const profileUser = computed(() => profile.value?.user ?? null)

// هل هذه صفحة بروفايلي؟
const isMyProfile = computed(() => {
  if (!props.currentUser || !profileUser.value) return false
  if (!props.currentUser._id || !profileUser.value._id) return false

  return props.currentUser._id === profileUser.value._id
})

// ===============================
// Follow / Evaluate visibility
// ===============================
const canFollow = computed(() => {
  if (!props.currentUser || !profileUser.value) return false

return !isMyProfile.value
})

const canEvaluate = computed(() => {
  if (!props.currentUser || !profileUser.value) return false
  if (!props.currentUser.role || !profileUser.value.role) return false

  return (
    props.currentUser.role === 'professor' &&
    profileUser.value.role === 'student' &&
    !isMyProfile.value
  )
})

// ===============================
// Follow logic
// ===============================
const isFollowing = ref(false)
const isLoading = ref(false)

const toggleFollow = async (e: MouseEvent) => {
  e.stopPropagation()

  if (isLoading.value || !profileUser.value) return

  isLoading.value = true
  try {
    if (!isFollowing.value) {
      await useFollowUser(profileUser.value._id)
      isFollowing.value = true
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    v-if="profile"
    class="sm:mt-16 mt-10 px-4 sm:px-6 md:px-8"
  >
    <!-- ===============================
         Follow / Evaluate Actions
    =============================== -->
    <div
      v-if="props.currentUser && profileUser"
      class="profile-actions mb-4 flex gap-3"
    >
      <button
        v-if="canFollow"
        class="btn btn-outline"
        :disabled="isLoading"
        @click="toggleFollow"
      >
        {{ isFollowing ? 'تمت المتابعة' : 'متابعة' }}
      </button>

      <button
        v-if="canEvaluate"
        class="btn btn-primary"
      >
        منح تقييم
      </button>
    </div>

    <!-- ===============================
         Owner Actions
    =============================== -->
    <div class="flex w-full justify-end">
      <UButton
        v-if="isOwner"
        color="secondary"
        variant="outline"
        class="rounded-full flex items-center mx-3 gap-2"
        @click="showQrModal = true"
      >
        <UIcon
          name="i-heroicons-qr-code"
          class="w-5 h-5"
        />
        Share
      </UButton>

      <div class="flex gap-x-3 flex-wrap">
        <UButton
          v-if="isOwner"
          color="primary"
          class="rounded-full"
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
    </div>

    <!-- ===============================
         Profile Info
    =============================== -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div class="space-y-2">
        <div class="flex w-full justify-between">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ profile?.fullName }}
          </h2>

          <button
            class="md:hidden flex items-center gap-2 text-gray-800"
            @click="emit('openSidebar')"
          >
            <span class="font-medium">Menu</span>
          </button>
        </div>

        <div class="flex items-center gap-2 text-gray-700">
          <UIcon
            name="i-heroicons-envelope"
            class="w-5 h-5"
          />
          <span>{{ profileUser?.email || '' }}</span>
        </div>

        <p class="text-gray-600 sm:w-3xl w-full mt-2">
          {{ bio }}
        </p>
      </div>
    </div>

    <!-- ===============================
         Logout Modal
    =============================== -->
    <UModal v-model:open="showLogoutConfirm">
      <template #title>
        Logout Confirmation
      </template>
      <template #body>
        Are you sure you want to log out?
      </template>
      <template #footer>
        <UButton
          variant="ghost"
          @click="showLogoutConfirm = false"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          @click="confirmLogout"
        >
          Logout
        </UButton>
      </template>
    </UModal>

    <!-- ===============================
         QR Modal
    =============================== -->
    <UModal v-model:open="showQrModal">
      <template #title>
        Share Profile
      </template>
      <template #body>
        <ClientOnly>
          <img
            v-if="qrData?.qrCode"
            :src="qrData.qrCode"
            class="w-48 h-48"
          >
        </ClientOnly>
      </template>
      <template #footer>
        <UButton
          block
          @click="showQrModal = false"
        >
          Close
        </UButton>
      </template>
    </UModal>

    <!-- ===============================
         Edit Modal
    =============================== -->
    <EditProfileModal
      v-model="showEdit"
      :profile="profile"
      @updated="refresh"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGetProfileQR } from '@@/queries/Profile/student/information'
import EditProfileModal from '@@/components/Profile/updateProfileInformation.vue'
import { useLogout } from '@@/queries/Auth/admin'
import { useProfile } from '@@/composables/useProfile'
import { useProfessorEvaluateStudent } from '@@/queries/Evaluation/evaluate'
import { useCheckFollow, useFollowUser, useUnfollowUser } from '@@/queries/follow'

const store = useGlobalStore()
const courseraStore = useCourseraStore()
const router = useRouter()
const emit = defineEmits(['openSidebar', 'updated'])
const { profile, refresh, isOwner } = useProfile()

const currentUser = computed(() => ({
  _id: store.id,
  role: store.role,
}))

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
const showEdit = ref(false)
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
const bio = computed(() =>
  profile.value?.bio
    ? profile.value.bio.replace(/\s+/g, ' ').trim()
    : 'No bio available',
)
const isMyProfile = computed(() => {
  if (!profile.value) return false

return currentUser.value._id === profile.value.user._id
})

const canFollow = computed(() => {
  return !!profile.value && !isMyProfile.value
})

const canEvaluate = computed(() => {
  if (!profile.value) return false

return (
    currentUser.value.role === 'professor' &&
    profile.value.user.role === 'student' &&
    !isMyProfile.value
  )
})
const isFollowing = ref(false)
const isFollowLoading = ref(false)
const isFollowStatusLoading = ref(true)

const toggleFollow = async () => {
  if (!profile.value || isFollowLoading.value) return

  isFollowLoading.value = true

  try {
    if (isFollowing.value) {
      const { execute } = useUnfollowUser(profile.value.user._id)
      await execute()
      isFollowing.value = false
    } else {
      const { execute } = useFollowUser(profile.value.user._id)
      await execute()
      isFollowing.value = true
    }
  } catch (e) {
    useToast().add({
      description: 'Action failed',
      color: 'error',
    })
  } finally {
    isFollowLoading.value = false
  }
}

watch(
  () => profile.value?.user?._id,
  async (userId) => {
    if (!userId || isMyProfile.value) {
      isFollowStatusLoading.value = false

      return
    }
    isFollowStatusLoading.value = true
    const followStatus = await useCheckFollow(userId)
    isFollowing.value = followStatus.isFollowing
    isFollowStatusLoading.value = false
  },
  { immediate: true },
)

const showEvaluateModal = ref(false)
const evaluationForm = ref({
  technicalCompetency: 0,
  practicalCompetency: 0,
  problemSolving: 0,
  analyticalThinking: 0,
  communicationDocumentation: 0,
  overallComment: '',
})
const evaluateStatus = ref(false)
const submitEvaluation = async () => {
  if (!profile.value) return

  try {
    await $fetch('http://127.0.0.1:5000/api/evaluate', {
      method: 'POST',
      headers: {
      Authorization: `Bearer ${useGlobalStore().token}`,
      'Content-Type': 'application/json',
    },
      body: {
        student: profile.value.user._id,
        competencies: {
          technicalCompetency: evaluationForm.value.technicalCompetency,
          practicalCompetency: evaluationForm.value.practicalCompetency,
          problemSolving: evaluationForm.value.problemSolving,
          analyticalThinking: evaluationForm.value.analyticalThinking,
          communicationDocumentation: evaluationForm.value.communicationDocumentation,
        },
        overallComment: evaluationForm.value.overallComment,
      },
    })

    useToast().add({
      description: 'Evaluation submitted successfully',
      color: 'success',
    })

    showEvaluateModal.value = false
  } catch {
    useToast().add({
      description: 'Evaluation failed',
      color: 'error',
    })
  }
}

const onUpdated = async () => {
  await refresh()
  emit('updated')
}
</script>

<template>
  <div class="sm:mt-16 mt-10 px-4 sm:px-6 md:px-8">
    <div class="flex w-full justify-end gap-3">
      <UButton
        v-if="canFollow"
        :loading="isFollowStatusLoading || isFollowLoading"
        :disabled="isFollowStatusLoading"
        variant="outline"
        color="primary"
        class="bg-primary text-white hover:text-primary"
        @click="toggleFollow"
      >
        <template v-if="isFollowStatusLoading">
          Loading...
        </template>
        <template v-else>
          {{ isFollowing ? 'Remove Follow' : 'Follow' }}
        </template>
      </UButton>

      <UButton
        v-if="canEvaluate"
        color="primary"
        class="bg-primary text-white hover:text-primary"
        @click="showEvaluateModal = true"
      >
        Evaluate
      </UButton>
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
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold text-gray-900">
          {{ profile?.fullName }}
        </h2>
        <div class="flex gap-x-5">
          <button
            v-if="isOwner"
            class="md:hidden flex items-center gap-2 text-gray-800"
            @click="emit('openSidebar')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
              />
              <line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
              />
              <line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
              />
            </svg>
            <span class="font-medium">Menu</span>
          </button>
        </div>

        <p class="text-secondary">
          {{ profile?.postion || 'No Position' }}
        </p>

        <p class="text-primary font-bold">
          {{ profile?.university || 'No University' }}
        </p>

        <p class="text-primary font-bold">
          {{ profile?.address || 'No Address' }}
        </p>

        <p class="text-gray-700">
          {{ profile?.user?.email }}
        </p>

        <p class="text-gray-600 mt-2">
          {{ bio }}
        </p>
      </div>
    </div>

    <UModal
      v-model:open="showLogoutConfirm"
      class="bg-white text-black"
    >
      <template #title>
        <p class="text-black">
          Logout Confirmation
        </p>
      </template>
      <template #body>
        Are you sure you want to log out?
      </template>
      <template #footer>
        <div class="flex gap-2 text-white justify-end w-full">
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
      v-model:open="showEvaluateModal"
      class="bg-white text-black"
    >
      <template #title>
        <p class="text-black">
          Evaluate Student
        </p>
      </template>

      <template #body>
        <div class="space-y-3 grid grid-cols-2 gap-4">
          <UFormField
            label="Technical Competency"
            name="technicalCompetency"
          >
            <UInput
              v-model="evaluationForm.technicalCompetency"
              type="number"
              label="Technical Competency"
              class="w-full"
              min="0"
              max="10"
            />
          </UFormField>
          <UFormField
            label="Practical Competency"
            name="practicalCompetency"
          >
            <UInput
              v-model="evaluationForm.practicalCompetency"
              type="number"
              label="Practical Competency"
              class="w-full"
              min="0"
              max="10"
            />
          </UFormField>
          <UFormField
            label="Problem Solving"
            name="problemSolving"
          >
            <UInput
              v-model="evaluationForm.problemSolving"
              type="number"
              label="Problem Solving"
              class="w-full"
              min="0"
              max="10"
            />
          </UFormField>
          <UFormField
            label="Analytical Thinking"
            name="analyticalThinking"
          >
            <UInput
              v-model="evaluationForm.analyticalThinking"
              type="number"
              label="Analytical Thinking"
              class="w-full"
              min="0"
              max="10"
            />
          </UFormField>
          <UFormField
            label="Communication & Documentation"
            name="communicationDocumentation"
          >
            <UInput
              v-model="evaluationForm.communicationDocumentation"
              type="number"
              label="Communication & Documentation"
              class="w-full"
              min="0"
              max="10"
            />
          </UFormField>
        </div>
        <UFormField
          label="Overall Comment"
          name="overallComment"
          class="my-5 mx-auto text-center w-full"
        >
          <UTextarea
            v-model="evaluationForm.overallComment"
            label="Overall Comment"
            class="text-center w-full"
          />
        </UFormField>
      </template>

      <template #footer>
        <div class="flex justify-end w-full text-white gap-2">
          <UButton @click="showEvaluateModal = false">
            Cancel
          </UButton>
          <UButton
            color="primary"
            :loading="evaluateStatus"
            @click="submitEvaluation"
          >
            Submit
          </UButton>
        </div>
      </template>
    </UModal>

    <EditProfileModal
      v-model="showEdit"
      :profile="profile"
      @updated="onUpdated"
    />
  </div>
</template>

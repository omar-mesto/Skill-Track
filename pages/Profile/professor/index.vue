<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGetProfileQR } from '@@/queries/Profile/student/information'
import ProfileSidebar from '~/components/layout/ProfileSidebar.vue'
import { ProfileProfessorProfileHeader } from '#components'
import ProfileProfessorInformation from '~/components/Profile/professor/ProfileProfessorInformation.vue'
import ProfileProfessorTabs from '~/components/Profile/ProfileProfessorTabs.vue'

const router = useRouter()
const storage = useGlobalStore()

const sidebarOpen = ref(false)

const { profile } = useProfessorProfile()

const showQrModal = ref(false)
const { data: qrResponse, refresh: fetchQr } = useGetProfileQR()

const qrData = computed(() => qrResponse.value?.data || null)

watch(showQrModal, (v) => {
  if (v) fetchQr()
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
</script>

<template>
  <div class="flex min-h-screen bg-[#F4F7FB]">
    <div
      v-if="sidebarOpen"
      class="lg:hidden fixed inset-0 z-40"
    >
      <div
        class="absolute inset-0 bg-black/40"
        @click="sidebarOpen = false"
      />
    </div>

    <ProfileSidebar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <main class="flex-1 bg-white">
      <ProfileProfessorProfileHeader />

      <div class="w-full px-4 sm:px-10 md:px-20 shadow-2xl rounded-b-xl p-5">
        <ProfileProfessorInformation
          @open-sidebar="sidebarOpen = true"
          @open-qr="showQrModal = true"
        />

        <ProfileProfessorTabs />
      </div>
    </main>

    <UModal
      v-model:open="showQrModal"
      class="bg-white shadow-2xl text-black"
    >
      <template #title>
        Share Profile
      </template>

      <template #body>
        <div class="flex flex-col items-center gap-4">
          <ClientOnly>
            <img
              v-if="qrData?.qrCode"
              :src="qrData.qrCode"
              class="w-48 h-48"
              alt="QR Code"
            >

            <button
              v-if="qrData?.profileUrl"
              class="text-primary underline text-sm break-all hover:text-primary/80"
              @click="copyProfileUrl"
            >
              {{ qrData.profileUrl }}
            </button>
          </ClientOnly>
        </div>
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
  </div>
</template>

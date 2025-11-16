<script lang="ts" setup>
import { h } from 'vue'
import type { Row } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

import { useGetApprovals, useApproveRequest, useRejectRequest } from '@@/queries/Dashbaord/requests'
import type { ProfessorApprovalsData, SingleApprovalResponse } from '@@/models/professorModel'
import type { Professor } from '@@/models/approvalModel'

type ProfessorRow = Professor

const openModel = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const pedingAction = ref(true)
const selectedItem = ref<Professor | null>(null)
const modalActionType = ref<'approve' | 'reject' | null>(null)

const toast = useToast()

const { data, pending, execute, refresh } = useGetApprovals('professor')

onMounted(() => {
  execute()
})

const responseData = computed(
  () => data.value as SingleApprovalResponse<ProfessorApprovalsData>,
)

const allProfessors = computed<ProfessorRow[]>(() => {
  return responseData.value?.data?.data ?? []
})

const page = ref(1)
const limit = 10

const pagination = computed(() => ({
  total: allProfessors.value.length,
  limit,
}))

const paginatedProfessors = computed(() => {
  const start = (page.value - 1) * limit

return allProfessors.value.slice(start, start + limit)
})

const columns: TableColumn<ProfessorRow>[] = [
  {
    header: 'Professor',
    cell: ({ row }) => {
      const prof = row.original
      const name = prof.name
      const avatar = prof.avatar

      const API_BASE_URL = 'http://127.0.0.1:5000/'

      const normalizedPath = avatar
        ? avatar.replace(/\\/g, '/')
        : null

      const fullImageUrl = normalizedPath
        ? `${API_BASE_URL}${normalizedPath}`
        : '/AdminLogin.png'

      return h(
        'div',
        { class: 'flex items-center gap-3' },
        [
          h(resolveComponent('UAvatar'), {
            src: fullImageUrl,
            size: 'sm',
            class: 'object-cover',
          }),
          h('span', { class: 'font-semibold text-black' }, name),
        ],
      )
    },
  },

  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'specialization', header: 'Specialization' },
  { accessorKey: 'bio', header: 'Bio' },
  {
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) =>
    h(
      resolveComponent('UDropdownMenu'),
      {
        items: getRowActions(row),
        ui: {
          item: 'text-black hover:bg-primary rounded-md',
          content: 'bg-white text-black shadow-md rounded-md',
        },
      },
      () =>
        h(resolveComponent('UButton'), {
          icon: 'i-lucide-ellipsis-vertical',
          variant: 'ghost',
        }),
    ),
},
]

function getRowActions(row: Row<ProfessorRow>) {
  const item = row.original

  return [
    {
      label: 'Copy ID',
      onSelect: () => {
        navigator.clipboard.writeText(item.id)
        toast.add({
        description: 'Professor ID Copied to Clipboard!',
        ui: {
          root: 'bg-white text-black border border-gray-300 shadow-md',
        },
      })
      },
    },
    ...(item.approvalStatus === 'pending'
      ? [
          { label: 'Approve', onSelect: () => openModal('approve', item) },
          { label: 'Reject', onSelect: () => openModal('reject', item) },
        ]
      : []),
  ]
}

function openModal(action: 'approve' | 'reject', item: ProfessorRow) {
  selectedItem.value = item
  modalActionType.value = action
  modalTitle.value = `${action === 'approve' ? 'Approve' : 'Reject'} ${item.name}`
  modalMessage.value = `Are you sure you want to ${action} this request?`
  openModel.value = true
}

async function confirmAction() {
  if (!selectedItem.value || !modalActionType.value) return

  const { id } = selectedItem.value
  const action = modalActionType.value

  try {
    const service =
      action === 'approve'
        ? useApproveRequest('professor', id)
        : useRejectRequest('professor', id)

    pedingAction.value = true
    await service.execute()

    toast.add({
      title: `Professor ${action}d successfully`,
      color: 'success',
      ui: {
        root: 'bg-white text-primary',
        title: 'text-black',
        description: 'text-black',
      },
    })

    refresh()
    pedingAction.value = false
  } catch {
    toast.add({
      title: 'Error processing request',
      color: 'error',
      ui: {
        root: 'bg-white text-primary',
        title: 'text-black',
        description: 'text-black',
      },
    })
    pedingAction.value = false
  }

  openModel.value = false
  selectedItem.value = null
  modalActionType.value = null
}

const isSidebarOpen = ref(true)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)
</script>

<template>
  <div class="flex flex-col bg-[#F5F5F5] h-screen">
    <DashboardNavBar :toggle-sidebar="toggleSidebar" />
    <div class="flex flex-1 min-h-0 min-w-0">
      <DashboardSideBar :is-open="isSidebarOpen" />
      <div class="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <h1 class="text-2xl text-primary font-bold mb-4">
          Professor Requests
        </h1>

        <div
          v-if="pending"
          class="text-center text-primary w-full text-2xl overflow-x-auto rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          Loading...
        </div>

        <div
          v-else
          class="rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          <div class="overflow-x-auto w-full">
            <UTable
              ref="table"
              :data="paginatedProfessors"
              :columns="columns"
              sticky
              class="text-black"
            />
          </div>

          <div class="flex justify-end py-2 text-black px-3 border-t">
            <UPagination
              v-model:page="page"
              :total="pagination.total"
              :items-per-page="pagination.limit"
            />
          </div>
        </div>
      </div>
    </div>

    <UModal
      v-model:open="openModel"
      class="bg-white shadow-2xl"
    >
      <template #title>
        <p class="text-black font-bold">
          {{ modalTitle }}
        </p>
      </template>
      <template #body>
        <p class="text-black">
          {{ modalMessage }}
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end w-full  gap-2">
          <UButton
            variant="ghost"
            @click="openModel = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            :leading="pedingAction"
            @click="confirmAction"
          >
            Confirm
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
:deep(thead) {
  background-color: #9FBEDD !important;
  box-shadow: 2px 2px black !important;
}
</style>

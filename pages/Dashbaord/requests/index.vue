<script lang="ts" setup>
import { h } from 'vue'
import type { Row } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

import { useGetApprovals, useApproveRequest, useRejectRequest } from '@@/queries/Dashbaord/requests'
import type { Company } from '@@/models/approvalModel'
import type { CompanyApprovalsData, SingleApprovalResponse } from '~/models/companyModel'
import { UAvatar } from '#components'

type CompanyRow = Company

const openModel = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const selectedItem = ref<Company | null>(null)
const modalActionType = ref<'approve' | 'reject' | null>(null)
const API_BASE_URL = 'http://127.0.0.1:5000/'

const toast = useToast()

const { data, pending, execute, refresh } = useGetApprovals('company')

onServerPrefetch(async () => {
  await execute()
})

onMounted(async () => {
  if (!data.value) await execute()
})

const responseData = computed(
  () => data.value as SingleApprovalResponse<CompanyApprovalsData>)

const allCompanies = computed<CompanyRow[]>(() => {
  return responseData.value?.data?.data ?? []
})

const page = ref(1)
const limit = 10

const pagination = computed(() => ({
  total: allCompanies.value.length,
  limit,
}))

const paginatedCompanies = computed(() => {
  const start = (page.value - 1) * limit

  return allCompanies.value.slice(start, start + limit)
})

const columns: TableColumn<CompanyRow>[] = [
  {
    header: 'Company',
    cell: ({ row }) => {
      const company = row.original
      const name = company.name
      const avatar = company.avatar
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
          h(UAvatar, {
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
  { accessorKey: 'bio', header: 'Bio' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h(
        'div',
        {},
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
      ),
  },
]

function getRowActions(row: Row<CompanyRow>) {
  const company = row.original

  return [
    {
      label: 'Copy ID',
      onSelect: () => {
        navigator.clipboard.writeText(company.id)
        toast.add({
        description: 'Company ID Copied to Clipboard!',
        ui: {
          root: 'bg-white text-black border border-gray-300 shadow-md',
        },
      })
      },
    },

    ...(company.approvalStatus === 'pending'
      ? [
          { label: 'Approve', onSelect: () => openModal('approve', company) },
          { label: 'Reject', onSelect: () => openModal('reject', company) },
        ]
      : []),
  ]
}

function openModal(action: 'approve' | 'reject', item: CompanyRow) {
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
        ? useApproveRequest('company', id)
        : useRejectRequest('company', id)

    await service.execute()

    toast.add({
      title: `Company ${action}d successfully`,
      color: 'success',
      ui: {
        root: 'bg-white text-primary',
        title: 'text-black',
        description: 'text-black',
      },
    })

    refresh()
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
  }

  openModel.value = false
  selectedItem.value = null
  modalActionType.value = null
}

const isSidebarOpen = ref(true)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)
</script>

<template>
  <div class="flex bg-[#F5F5F5] flex-col h-screen">
    <DashboardNavBar :toggle-sidebar="toggleSidebar" />
    <div class="flex flex-1 min-h-0 min-w-0">
      <DashboardSideBar :is-open="isSidebarOpen" />
      <div class="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <h1 class="text-2xl font-bold text-primary mb-4">
          Company Requests
        </h1>

        <div
          v-if="pending"
          class="text-center text-primary w-full text-2xl overflow-x-auto rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          Loading...
        </div>

        <div
          v-else-if="paginatedCompanies"
          class="rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          <UTable
            ref="table"
            :data="paginatedCompanies"
            sticky
            :columns="columns"
            class="text-black"
          />

          <div class="flex justify-end py-2 text-black px-3 border-t">
            <UPagination
              v-if="pagination"
              v-model:page="page"
              :ui="{ item: 'text-white' }"
              :total="pagination.total"
              :items-per-page="pagination.limit"
            />
          </div>
        </div>
      </div>
    </div>

    <UModal
      v-model:open="openModel"
      class="bg-white"
    >
      <template #title>
        <p class="text-black font-bold">
          {{ modalTitle }}
        </p>
      </template>
      <template #body>
        <P class="text-black">
          {{ modalMessage }}
        </P>
      </template>

      <template #footer>
        <div class="flex justify-end w-full gap-2">
          <UButton
            color="primary"
            variant="ghost"
            @click="openModel = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
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

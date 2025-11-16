<script lang="ts" setup>
import { h } from 'vue'
import type { Row } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

import { useGetApprovals, useApproveRequest, useRejectRequest } from '@@/queries/Dashbaord/requests'
import type { Company } from '@@/models/approvalModel'
import type { CompanyApprovalsData, SingleApprovalResponse } from '~/models/companyModel'

type CompanyRow = Company

const openModel = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const selectedItem = ref<Company | null>(null)
const modalActionType = ref<'approve' | 'reject' | null>(null)

const toast = useToast()

const { data, pending, execute, refresh } = useGetApprovals('company')

onMounted(() => {
  execute()
})

const responseData = computed(
  () => data.value as SingleApprovalResponse<CompanyApprovalsData>,
)

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
  { accessorKey: 'name', header: 'Company Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'bio', header: 'Bio' },

  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('approvalStatus') as string
      const color =
        status === 'approved'
          ? 'text-green-600 font-semibold'
          : status === 'rejected'
            ? 'text-red-600 font-semibold'
            : 'text-yellow-500 font-semibold'

      return h('span', { class: color }, status)
    },
  },

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
      onSelect: () => navigator.clipboard.writeText(company.id),
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
    })

    refresh()
  } catch {
    toast.add({
      title: 'Error processing request',
      color: 'error',
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
  <div class="flex flex-col bg-[#F5F5F5] h-screen overflow-hidden">
    <DashboardNavBar :toggle-sidebar="toggleSidebar" />
    <div class="flex flex-1">
      <DashboardSideBar :is-open="isSidebarOpen" />

      <div class="flex-1 p-6">
        <h1 class="text-2xl font-bold text-primary mb-4">
          Company Requests
        </h1>

        <div
          v-if="pending"
          class="text-center text-xl py-10"
        >
          Loading...
        </div>

        <div
          v-else
          class="rounded-lg shadow text-black pb-3"
        >
          <div class="overflow-x-auto w-full">
            <UTable
              :data="paginatedCompanies"
              :columns="columns"
              class="min-w-[800px]"
            />
          </div>

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

    <UModal v-model:open="openModel">
      <template #title>
        {{ modalTitle }}
      </template>
      <template #body>
        {{ modalMessage }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
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

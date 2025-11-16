import { useAPI } from '@@/services/baseApi'
import type { ApproveRejectResponse, CompanyApprovalsData, ProfessorApprovalsData, SingleApprovalResponse } from '~/models/companyModel'

export const useGetApprovals = (type: 'company' | 'professor') => {
  return useAPI<SingleApprovalResponse<CompanyApprovalsData | ProfessorApprovalsData>>({
    url: `/approval/admin/allrequest?type=${type}`,
    queryKey: `approvals`,
    type: 'GET',
  })
}

export const useApproveRequest = (type: 'company' | 'professor', id: string) => {
  return useAPI<ApproveRejectResponse>({
    url: () => `/approval/admin/approve/${type}/${id}`,
    queryKey: `approvals`,
    type: 'PUT',
    isLazy: true,
  })
}

export const useRejectRequest = (type: 'company' | 'professor', id: string) => {
  return useAPI<ApproveRejectResponse>({
    url: () => `/approval/admin/reject/${type}/${id}`,
    queryKey: `approvals`,
    type: 'PUT',
    isLazy: true,
  })
}

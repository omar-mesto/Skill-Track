import type { Professor } from './approvalModel'

export interface ProfessorApprovalsData {
  data: Professor[]
}
export interface SingleApprovalResponse<T> {
  success: boolean
  message: string
  data: T
}

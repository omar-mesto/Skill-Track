export interface Company {
  id: string
  name: string
  email: string
  bio?: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export interface Professor {
  id: string
  name: string
  email: string
  specialization?: string
  bio?: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export interface CompanyApprovalsData {
  total: number
  page: number
  limit: number
  totalPages: number
  data: Company[]
}

export interface ProfessorApprovalsData {
  total: number
  page: number
  limit: number
  totalPages: number
  data: Professor[]
}

export interface SingleApprovalResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApproveRejectResponse {
  success: boolean
  message: string
  data: Record<string, never>
}

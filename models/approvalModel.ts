export interface Company {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export interface Professor {
  id: string
  name: string
  email: string
  specialization?: string
  bio?: string
  avatar?: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export interface ApprovalsData {
  companies: Company[]
  professors: Professor[]
}

export interface ApprovalsResponse {
  success: boolean
  message: string
  data: ApprovalsData
}

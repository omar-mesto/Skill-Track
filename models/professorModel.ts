import type { Professor } from './approvalModel'

export interface ProfessorApprovalsData {
  data: Professor[]
}
export interface SingleApprovalResponse<T> {
  success: boolean
  message: string
  data: T
}
export interface BaseUser {
  _id: string
  name: string
  email: string
  avatar?: string
  coverImage?: string
  role: 'student' | 'professor' | 'company'
}

export interface Profile {
  _id: string
  user: BaseUser
  fullName: string
  bio?: string
  university?: string
  phone?: string
  address?: string
  postion?: string
}

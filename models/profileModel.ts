export type UserRole = 'student' | 'professor' | 'company'

export interface ProfileUser {
  _id: string
  name: string
  email: string
  avatar?: string
  coverImage?: string
  role: UserRole
}

export interface Profile {
  _id: string
  user: ProfileUser
  fullName: string
  bio?: string
  university?: string
  phone?: string
  address?: string
  postion?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProfessorExtra {
  specialization?: string
  bio?: string
}

export interface FullProfileData {
  profile: Profile
  skills?: unknown[]
  projects?: unknown[]
  courseLinks?: unknown[]
  achievements?: unknown[]
  badges?: unknown[]
  posts?: unknown[]
  questions?: unknown[]
  professorExtra?: ProfessorExtra | null
}

export interface FullProfileResponse {
  success: boolean
  message: string
  data: FullProfileData
}

export interface ProfileUser {
  _id: string
  name: string
  email: string
  avatar?: string
  coverImage?: string
  role: UserRole
}

export interface CompanyExtra {
  _id: string
  companyName: string
  bio?: string
  approvalStatus?: string
}

export interface CompanyProfileData {
  profile: {
    user: ProfileUser & { role: 'company' }
    fullName: string
  }
  companyExtra: CompanyExtra
}

export interface CompanyProfileResponse {
  success: boolean
  message: string
  data: CompanyProfileData
}

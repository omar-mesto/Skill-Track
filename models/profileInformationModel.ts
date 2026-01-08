export interface ProfileResponse {
  success: boolean
  message: string
  data: {
    user: {
      _id: string
      name: string
      email: string
      avatar: string
      coverImage: string
      role: string
    }
    fullName: string
    bio: string
    university: string
    phone: string
    address: string
    socialLinks: Record<string, string>
    postion: string
  }
}

export interface UpdateProfileDto {
  fullName: string
  bio: string
  university: string
  phone: string
  address: string
  postion: string
}

export interface ProfileUser {
  _id: string
  name: string
  email: string
  avatar: string
  coverImage: string
  role: string
}

export interface ProfileData {
  user: ProfileUser
  fullName: string
  bio: string
  university: string
  phone: string
  address: string
  socialLinks: Record<string, string>
  postion: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: ProfileData
}

export interface UpdateProfileDto {
  fullName: string
  bio: string
  university: string
  phone: string
  address: string
  postion: string
}

export interface CompanyProfileUser {
  _id: string
  name: string
  email: string
  role: string
  avatar: string
  coverImage: string
}

export interface CompanyExtra {
  _id: string
  companyName?: string
  bio?: string
  approvalStatus?: string
}

export interface CompanyProfileData {
  profile: {
    user: ProfileUser & { role: 'company' }
    fullName: string
  }
  companyExtra: CompanyExtra | null
}

export interface companyProfileResponse {
  success: boolean
  message: string
  data: CompanyProfileData
}

export interface ProfessorProfileUser {
  _id: string
  name: string
  email: string
  avatar: string
  coverImage: string
  role: string
}

export interface ProfessorExtra {
  _id: string
  bio?: string
  specialization?: string
  certificate?: string
  approvalStatus?: string
}

export interface ProfessorProfileData {
  profile: {
    user: ProfileUser & { role: 'professor' }
    fullName: string
  }
  professorExtra: ProfessorExtra | null
}

export interface ProfessorProfileResponse {
  success: boolean
  message: string
  data: ProfessorProfileData
}

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

export interface companyProfileData {
  user: ProfileUser
  name: string
  email: string
  password: string
  companyName: string
  bio: string
  avatar: string
  coverImage: string
}

export interface companyProfileResponse {
  success: boolean
  message: string
  data: companyProfileData
}

export interface CompanyProfileUser {
  _id: string
  name: string
  email: string
  role: string
  avatar: string
  coverImage: string
}

export interface CompanyProfileData {
  _id: string
  companyName: string
  bio: string
  approvalStatus: string
  createdAt: string
  updatedAt: string
  user: CompanyProfileUser
}

export interface CompanyProfileResponse {
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

export interface ProfessorProfileData {
  user: ProfessorProfileUser
  bio: string
}

export interface ProfessorProfileResponse {
  success: boolean
  message: string
  data: ProfessorProfileData
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    token: string
    name: string
    email: string
    role: string
    avatar?: string
    coverImage?: string
  }
}

export interface RegisterCompanyResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
    coverImage?: string
    companyName: string
    bio: string
  }
}

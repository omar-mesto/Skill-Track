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

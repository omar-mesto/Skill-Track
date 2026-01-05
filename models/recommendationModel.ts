export interface RecommendedUser {
  _id: string
  name: string
  email: string
  avatar: string | null
  role: 'student' | 'professor' | 'company'
  isFollowing?: boolean
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface RecommendationsPayload {
  data: RecommendedUser[]
  pagination: Pagination
}

export interface RecommendationsResponse {
  success: boolean
  message: string
  data: RecommendationsPayload
}

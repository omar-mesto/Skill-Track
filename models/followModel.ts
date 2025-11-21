export interface FollowUser {
  _id: string
  name: string
  email: string
  avatar: string | null
  role: string
}

export interface FollowItem {
  _id: string
  follower: string | FollowUser
  following: string | FollowUser

  createdAt: string
  updatedAt: string
}

export interface FollowListResponse {
  success: boolean
  message: string
  data: {
    message: string
    data: FollowItem[]
  }
}

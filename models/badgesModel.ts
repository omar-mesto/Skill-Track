export interface BadgeModel {
  _id: string
  profile: string
  name: string
  description: string
  skill: string
  level: 'bronze' | 'silver' | 'gold'
  type: 'skill' | 'course' | 'other'
  awardedBy: string
  awardedAt: string
  createdAt: string
  updatedAt: string
}

export interface GetBadgesResponse {
  success: boolean
  message: string
  data: BadgeModel[]
}

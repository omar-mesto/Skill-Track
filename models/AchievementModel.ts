export interface AchievementModel {
  _id: string
  profile: string
  title: string
  description: string
  date: string | null
  createdAt: string
  updatedAt: string
  certificate: string
  skillsIds?: string[]
}

export interface GetAchievementsResponse {
  success: boolean
  message: string
  data: AchievementModel[]
}

export interface CreateAchievementResponse {
  success: boolean
  message: string
  data: AchievementModel
}

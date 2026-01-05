export interface SkillModel {
  _id: string
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  linkedProjects: SkillLinkedProject[]
  linkedAchievements: SkillLinkedAchievement[]
  linkedCertificates: SkillLinkedCertificate[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface GetMySkillsResponse {
  success: boolean
  message: string
  data: SkillModel[]
}

export interface CreateSkillForm {
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface SkillResponse {
  success: boolean
  message: string
  data: SkillModel
}

export interface SkillLinkedProject {
  _id: string
  profile: string
  title: string
  description: string
  technologies: string[]
  link: string
  github: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface SkillLinkedCertificate {
  _id: string
  profile: string
  name: string
  provider: string
  issuedAt: string
  url: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface SkillLinkedAchievement {
  _id: string
  profile: string
  title: string
  description: string
  date: string
  certificate: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface StackTag {
  name: string
  count: number
  is_moderator_only: boolean
  is_required: boolean
  has_synonyms: boolean
}

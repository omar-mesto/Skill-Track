export interface CourseraCertificateModel {
  _id: string
  profile: string
  title: string
  description: string
  certificate: string
  skillsIds?: string[]
  createdAt: string
  updatedAt: string
  warning: string | null
}

export interface CourseraResponse {
  success: boolean
  message: string
  data: CourseraCertificateModel
}

export interface GetCourseraResponse {
  success: boolean
  message: string
  data: CourseraCertificateModel[]
}

export interface VerifyCourseraDto {
  shareUrl: string
}

export interface SkillModel {
  _id: string
  name: string
}

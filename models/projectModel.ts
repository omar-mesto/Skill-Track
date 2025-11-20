export interface ProjectModel {
  _id: string
  profile: string
  title: string
  description: string
  technologies: string[]
  github?: string
  demoUrl?: string
  warning?: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectResponse {
  success: boolean
  message: string
  data: ProjectModel
}

export interface ProjectResponse {
  success: boolean
  message: string
  data: ProjectModel
}

export interface GetProjectsResponse {
  success: boolean
  message: string
  data: ProjectModel[]
}

export interface CreateProjectDto {
  title: string
  description: string
  github: string
  link: string
  technologies: string[]
  skillsIds: string[]
}

export interface UpdateProjectDto {
  title: string
  description: string
  github: string
  demoUrl: string
  technologies: string[]
}

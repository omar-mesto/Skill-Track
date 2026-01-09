import type { TaskModel, SubmissionModel } from './taskModel'

export interface GetAllTasksResponse {
  success: boolean
  message: string
  data: TaskModel[]
}

export interface GetTaskDetailResponse {
  success: boolean
  message: string
  data: TaskModel
}

export interface CreateTaskResponse {
  success: boolean
  message: string
  data: TaskModel
}

export interface SubmitTaskResponse {
  success: boolean
  message: string
  data: SubmissionModel
}

export interface GetTaskSubmissionsResponse {
  success: boolean
  message: string
  data: SubmissionModel[]
}

export interface GetStudentSubmissionsResponse {
  success: boolean
  message: string
  data: SubmissionModel[]
}

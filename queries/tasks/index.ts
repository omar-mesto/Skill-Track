import { useAPI } from '@@/services/baseApi'
import type { CreateTaskPayload } from '~/models/taskModel'
import type { GetAllTasksResponse, GetTaskDetailResponse, CreateTaskResponse, SubmitTaskResponse, GetTaskSubmissionsResponse, GetStudentSubmissionsResponse } from '~/models/taskResponses'

export const useGetAllTasks = () => {
  return useAPI<GetAllTasksResponse>({
    url: '/task',
    type: 'GET',
    queryKey: 'all-tasks',
  })
}

export const useGetCompanyTasks = () => {
  return useAPI<GetAllTasksResponse>({
    url: '/task/company/my',
    type: 'GET',
    queryKey: 'company-tasks',
  })
}

export const useGetTaskDetail = (id: string) => {
  return useAPI<GetTaskDetailResponse>({
    url: `/task/${id}`,
    type: 'GET',
    queryKey: `task-${id}`,
  })
}

export const useCreateTask = (payload: CreateTaskPayload) => {
  return useAPI<CreateTaskPayload>({
    url: '/task',
    type: 'POST',
    payload,
    queryKey: 'create-task',
  })
}

export const useSubmitTask = (taskId: string, payload: {
  codeAnswer: string
  usedHints: boolean
}) => {
  return useAPI<SubmitTaskResponse>({
    url: `/task/${taskId}/submit`,
    type: 'POST',
    payload,
    queryKey: `submit-task-${taskId}`,
  })
}

export const useGetTaskSubmissions = (taskId: string) => {
  return useAPI<GetTaskSubmissionsResponse>({
    url: `/task/${taskId}/submissions`,
    type: 'GET',
    queryKey: `task-submissions-${taskId}`,
  })
}

export const useGetMySubmissions = (studentId: string) => {
  return useAPI<GetStudentSubmissionsResponse>({
    url: `/task/student/${studentId}/submissions`,
    type: 'GET',
    queryKey: `student-submissions-${studentId}`,
  })
}

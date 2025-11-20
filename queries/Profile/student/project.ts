import { useAPI } from '@@/services/baseApi'
import type { CreateProjectDto, GetProjectsResponse, ProjectModel, ProjectResponse, UpdateProjectDto } from '@@/models/projectModel'

export const useCreateProject = (payload: CreateProjectDto) => {
  return useAPI<ProjectResponse>({
    url: '/profile/create/Project',
    type: 'POST',
    payload,
    queryKey: 'create-project',
  })
}

export const useGetProjects = () => {
  return useAPI<GetProjectsResponse>({
    url: '/profile/get/Project',
    type: 'GET',
    queryKey: 'projects',
  })
}

export const useDeleteProject = (id: string) => {
  return useAPI({
    url: `/profile/delete/Project/${id}`,
    type: 'DELETE',
    queryKey: 'projects',
  })
}

export const useUpdateProject = (id: string, payload: UpdateProjectDto) => {
  return useAPI<ProjectResponse>({
    url: `/profile/update/Project/${id}`,
    type: 'PUT',
    payload,
    queryKey: 'projects',
  })
}

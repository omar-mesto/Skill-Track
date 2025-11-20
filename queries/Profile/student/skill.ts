import { useAPI } from '@@/services/baseApi'
import type { CreateSkillDto, GetMySkillsResponse, SkillResponse } from '@@/models/skillModel'

export const useGetMySkills = () => {
  return useAPI<GetMySkillsResponse>({
    url: '/skills/skill/mySkills',
    type: 'GET',
    queryKey: 'my-skills',
  })
}

export const useLinkSkill = (skillId: string, projectId: string, type: string) => {
  return useAPI({
    url: `/skills/skill/link/${skillId}`,
    type: 'POST',
    payload: {
      itemId: projectId,
      type: type,
    },
    queryKey: 'my-skills',
  })
}

export const useCreateSkill = (payload: CreateSkillDto) => {
  return useAPI<SkillResponse>({
    url: '/skills/skill/create',
    type: 'POST',
    payload,
    queryKey: 'create-skill',
  })
}

export const useDeleteSkill = (id: string) => {
  return useAPI({
    url: `/profile/delete/Skill/${id}`,
    type: 'DELETE',
    queryKey: 'delete-skill',
  })
}

export const useUpdateSkill = (id: string, payload: CreateSkillDto) => {
  return useAPI<SkillResponse>({
    url: `/profile/update/Skill/${id}`,
    type: 'PUT',
    payload,
    queryKey: 'update-skill',
  })
}

import { useAPI } from '@@/services/baseApi'
import type { CreateSkillForm, GetMySkillsResponse, SkillResponse } from '@@/models/skillModel'

export const useGetMySkills = () => {
  return useAPI<GetMySkillsResponse>({
    url: '/skills/skill/mySkills',
    type: 'GET',
    queryKey: 'my-skills',
  })
}

export const useLinkSkill = (skillId: string, itemId: string, type: 'project' | 'achievement' | 'certificate', skillIds: string[] = []) => {
  return useAPI({
    url: `/skills/skill/link/${skillId}`,
    type: 'POST',
    payload: { itemId, type, skillIds },
    queryKey: 'my-skills',
  })
}

export const useCreateSkill = (payload: CreateSkillForm) => {
  return useAPI<SkillResponse>({
    url: '/skills/skill/create',
    type: 'POST',
    payload,
    queryKey: 'create-skill',
  })
}

export const useDeleteSkill = (id: string) => {
  return useAPI({
    url: `/skills/skill/${id}`,
    type: 'DELETE',
    queryKey: 'delete-skill',
  })
}

export const useUpdateSkill = (id: string, payload: CreateSkillForm) => {
  return useAPI<SkillResponse>({
    url: `/profile/update/Skill/${id}`,
    type: 'PUT',
    payload,
    queryKey: 'update-skill',
  })
}

export const useGetSkillById = (skillId: string) => {
  return useAPI<SkillResponse>({
    url: `/skills/skill/${skillId}`,
    type: 'GET',
    queryKey: `skill-${skillId}`,
  })
}

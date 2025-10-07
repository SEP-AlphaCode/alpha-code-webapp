import { Skill, SkillModal } from "@/types/skills";
import { PagedResult } from "@/types/page-result";
import { activitiesHttp } from "@/utils/http";

export const getPagedSkills = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await activitiesHttp.get<PagedResult<Skill>>('/skills', {
      params: {
        page,
        size,
        search
      },
      signal // Add AbortSignal support
    });
    // Handle different response structures
    return response.data;

  } catch (error) {
    console.error("API Error in getPagedSKills:", error);
    throw error;
  }
};

export const createSkill = async (skillData: SkillModal) => {
  const response = await activitiesHttp.post('/skills', skillData);
  return response.data;
};

export const updateSkill = async (id: string, skillData: SkillModal) => {
  const response = await activitiesHttp.put(`/skills/${id}`, skillData);
  return response.data;
};

export const deleteSkill = async (id: string) => {
  const response = await activitiesHttp.delete(`/skills/${id}`);
  return response.data;
};
import { Skill, SkillResponse } from "@/types/skill";
import { activitiesHttp } from "@/utils/http";

// GET /api/v1/skills - Get all extended actions with pagination and optional filters
export const getAllSkills = async (page?: number, size?: number, search?: string, robotModelId?: string, signal?: AbortSignal) => {
  try {
    
    if (page !== undefined) page = page;
    if (size !== undefined) size = size;
    if (search) search = search;
    if (robotModelId) robotModelId = robotModelId;

    const response = await activitiesHttp.get<SkillResponse>('/skills', {
      signal
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// POST /api/v1/skills - Create new extended action
export const createSkill = async (skillData: Omit<Skill, 'id' | 'createdDate' | 'lastUpdate' | 'status' | 'statusText'>) => {
  try {
    const response = await activitiesHttp.post('/skills', skillData);
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};

// GET /api/v1/skills/code/{code} - Get action by code
export const getSkillByCode = async (code: string) => {
  try {
    const response = await activitiesHttp.get<Skill>(`/skills/code/${code}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skill by code:', error);
    throw error;
  }
};

// GET /api/v1/skills/name/{name} - Get action by name
export const getSkillByName = async (name: string) => {
  try {
    const response = await activitiesHttp.get<Skill>(`/skills/name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skill by name:', error);
    throw error;
  }
};

// GET /api/v1/skills/robot-model - Get extended action by robot model id
export const getSkillsByRobotModel = async (robotModelId: string, page?: number, size?: number, signal?: AbortSignal) => {
  try {
    
    if (page !== undefined) page = page;
    if (size !== undefined) size = size;

    const response = await activitiesHttp.get<SkillResponse>('/skills/robot-model', {
      params: { robotModelId, page, size } ,
      signal
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills by robot model:', error);
    throw error;
  }
};

// GET /api/v1/skills/{id} - Get action by id
export const getSkillById = async (id: string) => {
  try {
    const response = await activitiesHttp.get<Skill>(`/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skill by id:', error);
    throw error;
  }
};

// PATCH /api/v1/skills/{id} - Patch update extended action by id
export const patchSkill = async (id: string, skillData: Partial<Omit<Skill, 'id' | 'createdDate' | 'lastUpdate'>>) => {
  try {
    const response = await activitiesHttp.patch<Skill>(`/skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    console.error('Error patching skill:', error);
    throw error;
  }
};

// PUT /api/v1/skills/{id} - Update extended action by id
export const updateSkill = async (id: string, skillData: Omit<Skill, 'id' | 'createdDate' | 'lastUpdate'>) => {
  try {
    const response = await activitiesHttp.put<Skill>(`/skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

// DELETE /api/v1/skills/{id} - Delete extended action by id
export const deleteSkill = async (id: string) => {
  try {
    const response = await activitiesHttp.delete(`/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// PATCH /api/v1/skills/{id}/change-status - Change extended action status
export const changeSkillStatus = async (id: string, status: number) => {
  try {
    const response = await activitiesHttp.patch<Skill>(`/skills/${id}/change-status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error changing skill status:', error);
    throw error;
  }
};

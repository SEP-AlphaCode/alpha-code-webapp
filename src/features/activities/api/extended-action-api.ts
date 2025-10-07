import { PagedResult } from "@/types/page-result";
import { RobotCommand, RobotCommandResponse } from "@/types/extended-action";
import { activitiesHttp } from "@/utils/http";

export const getAllExtendedActions = async () => {
  try {
    const response = await activitiesHttp.get<RobotCommandResponse>('/extended-actions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPagedExtendedActions = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await activitiesHttp.get<RobotCommandResponse>('/extended-actions', {
      params: {
        page,
        size,
        search
      },
      signal
    });
    return response.data;
  } catch (error) {
    console.error("API Error in getPagedExtendedActions:", error);
    throw error;
  }
};

export const getExtendedActionById = async (id: string) => {
  const response = await activitiesHttp.get<RobotCommand>(`/extended-actions/${id}`);
  return response.data;
};

export const getExtendedActionByCode = async (code: string) => {
  try {
    const response = await activitiesHttp.get<RobotCommand>(`/extended-actions/code/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExtendedActionByName = async (name: string) => {
  try {
    const response = await activitiesHttp.get<RobotCommand>(`/extended-actions/name/${name}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExtendedActionsByRobotModel = async (robotModelId: string) => {
  try {
    const response = await activitiesHttp.get<RobotCommandResponse>(`/extended-actions/robot-model`, { 
      params: { robotModelId } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createExtendedAction = async (actionData: Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate' | 'status' | 'statusText'>) => {
  try {
    const response = await activitiesHttp.post('/extended-actions', actionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExtendedAction = async (id: string, actionData: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>>) => {
  try {
    const response = await activitiesHttp.put(`/extended-actions/${id}`, actionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchExtendedAction = async (id: string, actionData: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>>) => {
  try {
    const response = await activitiesHttp.patch(`/extended-actions/${id}`, actionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExtendedAction = async (id: string) => {
  try {
    const response = await activitiesHttp.delete(`/extended-actions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeExtendedActionStatus = async (id: string, status: number) => {
  try {
    const response = await activitiesHttp.patch(`/extended-actions/${id}/change-status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

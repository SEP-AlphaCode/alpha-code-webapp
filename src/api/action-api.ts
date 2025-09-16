import { Action, ActionModal } from "@/types/action";
import { PagedResult } from "@/types/page-result";
import { springHttp } from "@/utils/http";

export const getPagedActions = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await springHttp.get<PagedResult<Action>>('/actions', {
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
    console.error("API Error in getPagedActions:", error);
    throw error;
  }
};

export const createAction = async (actionData: ActionModal) => {
  const response = await springHttp.post('/actions', actionData);
  return response.data;
};

export const updateAction = async (id: string, actionData: ActionModal) => {
  const response = await springHttp.put(`/actions/${id}`, actionData);
  return response.data;
};

export const deleteAction = async (id: string) => {
  const response = await springHttp.delete(`/actions/${id}`);
  return response.data;
};
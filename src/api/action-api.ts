import { ActionModal } from "@/types/action";
import http from "@/utils/http";

export const getPagedActions = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await http.get('/actions', {
      params: {
        page,
        size,
        search
      },
      signal // Add AbortSignal support
    });
    console.log(response)
    // Handle different response structures
    return {
      data: response.data.data,
      total: response.data.total || response.data.data.length,
      page: response.data.page || page,
      size: response.data.size || size
    };

  } catch (error) {
    console.error("API Error in getPagedActions:", error);
    throw error;
  }
};

export const createAction = async (actionData: ActionModal) => {
  const response = await http.post('/actions', actionData);
  return response.data;
};

export const updateAction = async (id: string, actionData: ActionModal) => {
  const response = await http.put(`/actions/${id}`, actionData);
  return response.data;
};

export const deleteAction = async (id: string) => {
  const response = await http.delete(`/actions/${id}`);
  return response.data;
};
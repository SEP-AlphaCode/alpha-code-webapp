import { CreateAction } from "@/types/action";
import http from "@/utils/http";

export const getPagedActions = async (page: number, limit: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await http.get('/actions', {
      params: {
        page,
        limit,
        search
      },
      signal // Add AbortSignal support
    });
    
    // Handle different response structures
    if (response.data?.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || page,
        limit: response.data.limit || limit
      };
    } else if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: page,
        limit: limit
      };
    } else {
      return {
        data: [],
        total: 0,
        page: page,
        limit: limit
      };
    }
  } catch (error) {
    console.error("API Error in getPagedActions:", error);
    throw error;
  }
};

export const createAction = async (actionData: CreateAction) => {
  const response = await http.post('/actions', actionData);
  return response.data;
};
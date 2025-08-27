import { Dance, DanceModal } from "@/types/dance";
import { PagedResult } from "@/types/page-result";
import http from "@/utils/http";

export const getPagedDances = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await http.get<PagedResult<Dance>>('/dances', {
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
    console.error("API Error in getPagedDances:", error);
    throw error;
  }
};

export const createDance = async (danceData: DanceModal) => {
  const response = await http.post('/dances', danceData);
  return response.data;
};

export const updateDance = async (id: string, danceData: DanceModal) => {
  const response = await http.put(`/dances/${id}`, danceData);
  return response.data;
};

export const deleteDance = async (id: string) => {
  const response = await http.delete(`/dances/${id}`);
  return response.data;
};

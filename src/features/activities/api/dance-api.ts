import { Dance, DanceModal } from "@/types/dance";
import { PagedResult } from "@/types/page-result";
import { springHttp } from "@/utils/http";

export const getPagedDances = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await springHttp.get<PagedResult<Dance>>('/dances', {
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
  const response = await springHttp.post('/dances', danceData);
  return response.data;
};

export const updateDance = async (id: string, danceData: DanceModal) => {
  const response = await springHttp.put(`/dances/${id}`, danceData);
  return response.data;
};

export const deleteDance = async (id: string) => {
  const response = await springHttp.delete(`/dances/${id}`);
  return response.data;
};

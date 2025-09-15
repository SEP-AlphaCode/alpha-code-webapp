import {MakerRequest, MakerResponse} from '@/types/maker';
import { springHttp } from '@/utils/http';

export const createMarker = async (data: MakerRequest): Promise<MakerResponse> => {
  const response = await springHttp.post('/v1/markers', data);
  return response.data;
};

export const getMarkerById = async (id: string): Promise<MakerResponse> => {
  const response = await springHttp.get(`/markers/${id}`);
  return response.data;
};

export const updateMarker = async (id: string, data: Partial<MakerRequest>): Promise<MakerResponse> => {
  const response = await springHttp.put(`/markers/${id}`, data);
  return response.data;
};

export const deleteMarker = async (id: string): Promise<void> => {
  await springHttp.delete(`/markers/${id}`);
};

export const getAllMarkers = async (): Promise<MakerResponse> => {
  try {
    const response = await springHttp.get<MakerResponse>('/markers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMarkerStatus = async (id: string, status: string): Promise<MakerResponse> => {
  const response = await springHttp.patch(`/markers/${id}`, { status });
  return response.data;
};

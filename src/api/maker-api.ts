import http from '../utils/http';
import {MakerRequest, MakerResponse} from '@/types/maker';

export const createMarker = async (data: MakerRequest): Promise<MakerResponse> => {
  const response = await http.post('/v1/markers', data);
  return response.data;
};

export const getMarkerById = async (id: string): Promise<MakerResponse> => {
  const response = await http.get(`/markers/${id}`);
  return response.data;
};

export const updateMarker = async (id: string, data: Partial<MakerRequest>): Promise<MakerResponse> => {
  const response = await http.put(`/markers/${id}`, data);
  return response.data;
};

export const deleteMarker = async (id: string): Promise<void> => {
  await http.delete(`/markers/${id}`);
};

export const getAllMarkers = async (): Promise<MakerResponse> => {
  try {
    const response = await http.get<MakerResponse>('/markers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMarkerStatus = async (id: string, status: string): Promise<MakerResponse> => {
  const response = await http.patch(`/markers/${id}`, { status });
  return response.data;
};

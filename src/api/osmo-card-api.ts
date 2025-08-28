import { OsmoCard } from '@/types/osmo-card';
import { PagedResult } from '@/types/page-result';
import http from '@/utils/http';

export const getAllOsmoCards = async () => {
  try {
    const response = await http.get<PagedResult<OsmoCard>>('/osmo-cards');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOsmoCardById = async (id: string) => {
  const response = await http.get<OsmoCard>(`/osmo-cards/${id}`);
  return response.data;
};

export const createOsmoCard = async (osmoCardData: Omit<OsmoCard, 'id' | 'createdDate' | 'lastUpdate'>) => {
  const response = await http.post('/osmo-cards', osmoCardData);
  return response.data;
};

export const updateOsmoCard = async (id: string, osmoCardData: Partial<Omit<OsmoCard, 'id' | 'createdDate'>>) => {
  const response = await http.put(`/osmo-cards/${id}`, osmoCardData);
  return response.data;
};

export const deleteOsmoCard = async (id: string) => {
  const response = await http.delete(`/osmo-cards/${id}`);
  return response.data;
};
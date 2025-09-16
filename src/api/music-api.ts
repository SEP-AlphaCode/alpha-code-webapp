import { Music, MusicResponse } from '@/types/music';
import { springHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

export const getAllMusics = async () => {
  try {
    const response = await springHttp.get<PagedResult<Music>>('/musics');
    return response.data;
  } catch (error) {
    console.error('Error fetching all musics:', error);
    throw error;
  }
};

export const getPagedMusics = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await springHttp.get<MusicResponse>('/musics', {
      params: {
        page,
        size,
        search
      },
      signal
    });
    return response.data;
    } catch (error) {       
    console.error('Error fetching paged musics:', error);
    throw error;
  }
};
export const getMusicById = async (id: string) => {
    const response = await springHttp.get<Music>(`/musics/${id}`);
    return response.data;
};
export const createMusic = async (musicData: Omit<Music, 'id' | 'createdDate' | 'lastUpdate'>) => {
    const response = await springHttp.post('/musics', musicData);
    return response.data;
};
export const updateMusic = async (id: string, musicData: Partial<Omit<Music, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    const response = await springHttp.patch(`/musics/${id}`, musicData);
    return response.data;
};
export const deleteMusic = async (id: string) => {
    const response = await springHttp.delete(`/musics/${id}`);
    return response.data;
};  
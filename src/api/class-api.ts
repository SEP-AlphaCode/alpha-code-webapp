import { Class, ClassResponse } from '@/types/class';
import { springHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

export const getAllClasses = async () => {
  try {
    const response = await springHttp.get<PagedResult<Class>>('/api/v1/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching all classes:', error);
    throw error;
  }
};

export const getPagedClasses = async (page: number, size: number, status?: number, signal?: AbortSignal) => {
  try {
    const response = await springHttp.get<ClassResponse>('/api/v1/classes', {
      params: {
        page,
        size,
        status
      },
      signal
    });
    return response.data;
    } catch (error) {       
    console.error('Error fetching paged classes:', error);
    throw error;
  }
};

export const getClassById = async (id: string) => {
    const response = await springHttp.get<Class>(`/api/v1/classes/${id}`);
    return response.data;
};

export const createClass = async (classData: Omit<Class, 'id' | 'createdDate' | 'lastUpdate' | 'statusText' | 'teachers'>) => {
    const response = await springHttp.post('/api/v1/classes', classData);
    return response.data;
};

export const updateClass = async (id: string, classData: Partial<Omit<Class, 'id' | 'createdDate' | 'lastUpdate' | 'statusText' | 'teachers'>>) => {
    const response = await springHttp.patch(`/api/v1/classes/${id}`, classData);
    return response.data;
};

export const updateClassStatus = async (id: string, status: number) => {
    const response = await springHttp.patch(`/api/v1/classes/${id}/status`, { status });
    return response.data;
};

export const deleteClass = async (id: string) => {
    const response = await springHttp.delete(`/api/v1/classes/${id}`);
    return response.data;
};
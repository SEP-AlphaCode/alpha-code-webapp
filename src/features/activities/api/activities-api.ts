import { Activity, ActivitiesResponse } from '@/types/activities';
import { usersHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

export const getAllActivities = async () => {
  try {
    const response = await usersHttp.get<PagedResult<Activity>>('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching all activities:', error);
    throw error;
  }
};

export const getPagedActivities = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await usersHttp.get<ActivitiesResponse>('/activities', {
      params: {
        page,
        size,
        search
      },
      signal
    });
    return response.data;
  } catch (error: unknown) {       
    // Don't log or throw canceled errors
    if (error && typeof error === 'object') {
      const errorObj = error as { name?: string; code?: string };
      if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
        return Promise.reject(error); // Let React Query handle it
      }
    }
    console.error('Error fetching paged activities:', error);
    throw error;
  }
};

export const getActivityById = async (id: string) => {
    const response = await usersHttp.get<Activity>(`/activities/${id}`);
    return response.data;
};

export const createActivity = async (activityData: Omit<Activity, 'id' | 'createdDate' | 'lastUpdate'>) => {
    const response = await usersHttp.post('/activities', activityData);
    return response.data;
};

export const updateActivity = async (id: string, activityData: Partial<Omit<Activity, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    const response = await usersHttp.patch(`/activities/${id}`, activityData);
    return response.data;
};

export const deleteActivity = async (id: string) => {
    const response = await usersHttp.delete(`/activities/${id}`);
    return response.data;
};
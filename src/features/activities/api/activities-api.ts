import { Activity, ActivitiesResponse } from '@/types/activities';
import { activitiesHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

export const getAllActivities = async () => {
  try {
    const response = await activitiesHttp.get<PagedResult<Activity>>('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching all activities:', error);
    throw error;
  }
};

export const getPagedActivities = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await activitiesHttp.get<ActivitiesResponse>('/activities', {
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
    const response = await activitiesHttp.get<Activity>(`/activities/${id}`);
    return response.data;
};

export const createActivity = async (activityData: Omit<Activity, 'id' | 'createdDate' | 'lastUpdate'>) => {
  try {
    const response = await activitiesHttp.post('/activities', activityData);
    return response.data;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const updateActivity = async (id: string, activityData: Partial<Omit<Activity, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    const response = await activitiesHttp.patch(`/activities/${id}`, activityData);
    return response.data;
};

export const deleteActivity = async (id: string) => {
    const response = await activitiesHttp.delete(`/activities/${id}`);
    return response.data;
};
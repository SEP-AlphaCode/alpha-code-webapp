import { Bundle } from '@/types/bundle';
import { coursesHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

// GET /api/v1/bundles - Get all active bundles with pagination and optional search
export const getBundles = async (
  page?: number,
  size?: number,
  search?: string,
  signal?: AbortSignal
) => {
  try {
    const response = await coursesHttp.get<PagedResult<Bundle>>('/bundles', {
      params: {
        page,
        size,
        search,
      },
      signal,
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object') {
      const errorObj = error as { name?: string; code?: string };
      if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
        console.log('API Call canceled');
        return Promise.reject(error);
      }
    }
    console.error('Error fetching bundles:', error);
    throw error;
  }
};

// GET /api/v1/bundles/get-none-delete - Get all none delete bundles with pagination and optional search
export const getNoneDeleteBundles = async (
  page?: number,
  size?: number,
  search?: string,
  signal?: AbortSignal
) => {
  try {
    const response = await coursesHttp.get<PagedResult<Bundle>>('/bundles/get-none-delete', {
      params: {
        page,
        size,
        search,
      },
      signal,
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object') {
      const errorObj = error as { name?: string; code?: string };
      if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
        console.log('API Call canceled');
        return Promise.reject(error);
      }
    }
    console.error('Error fetching none delete bundles:', error);
    throw error;
  }
};

// GET /api/v1/bundles/{id} - Get bundle by id
export const getBundleById = async (id: string) => {
  try {
    const response = await coursesHttp.get<Bundle>(`/bundles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bundle by id:', error);
    throw error;
  }
};

// GET /api/v1/bundles/active/{id} - Get active bundle by id
export const getActiveBundleById = async (id: string) => {
  try {
    const response = await coursesHttp.get<Bundle>(`/bundles/active/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active bundle by id:', error);
    throw error;
  }
};

// POST /api/v1/bundles - Create new bundle
export const createBundle = async (bundleData: Omit<Bundle, 'id' | 'createdDate' | 'lastUpdated'>) => {
  try {
    const response = await coursesHttp.post<Bundle>('/bundles', bundleData);
    return response.data;
  } catch (error) {
    console.error('Error creating bundle:', error);
    throw error;
  }
};

// PUT /api/v1/bundles/{id} - Update bundle by id
export const updateBundle = async (id: string, bundleData: Partial<Omit<Bundle, 'id' | 'createdDate' | 'lastUpdated'>>) => {
  try {
    const response = await coursesHttp.put<Bundle>(`/bundles/${id}`, bundleData);
    return response.data;
  } catch (error) {
    console.error('Error updating bundle:', error);
    throw error;
  }
};

// PATCH /api/v1/bundles/{id} - Patch bundle by id
export const patchBundle = async (id: string, bundleData: Partial<Omit<Bundle, 'id' | 'createdDate' | 'lastUpdated'>>) => {
  try {
    const response = await coursesHttp.patch<Bundle>(`/bundles/${id}`, bundleData);
    return response.data;
  } catch (error) {
    console.error('Error patching bundle:', error);
    throw error;
  }
};

// DELETE /api/v1/bundles/{id} - Delete bundle by id
export const deleteBundle = async (id: string) => {
  try {
    const response = await coursesHttp.delete(`/bundles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bundle:', error);
    throw error;
  }
};

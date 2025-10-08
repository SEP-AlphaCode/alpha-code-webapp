import { Joystick, JoystickResponse } from "@/types/joystick";
import { activitiesHttp } from "@/utils/http";

// Simple in-memory cache to prevent duplicate requests
const requestCache = new Map<string, Promise<any>>();

// Helper function to create cache key
const createCacheKey = (endpoint: string, params: Record<string, any>) => {
  return `${endpoint}_${JSON.stringify(params)}`;
};

// Helper function to handle rate limited requests with exponential backoff
const handleRateLimitedRequest = async (requestFn: () => Promise<any>, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (error?.response?.status === 429 && attempt < maxRetries - 1) {
        // Wait with exponential backoff: 2s, 4s, 8s
        const delay = Math.min(2000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

export const createJoystick = async (joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate' | 'status'>) => {
  try {
    const response = await activitiesHttp.post('/joysticks', joystickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJoystickByAccountRobot = async (accountId: string, robotId: string) => {
  
  const cacheKey = createCacheKey('joysticks-by-account-robot', { accountId, robotId });
  
  // Check if there's already a pending request for the same parameters
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  // Create the request promise and cache it
  const requestPromise = handleRateLimitedRequest(async () => {
    const response = await activitiesHttp.get<JoystickResponse>('/joysticks/by-account-robot', {
      params: { accountId, robotId }
    });
    // If response is direct array, wrap it in joysticks property
    const processedData = Array.isArray(response.data) 
      ? { joysticks: response.data }
      : response.data;
    return processedData;
  });

  // Cache the promise
  requestCache.set(cacheKey, requestPromise);

  // Clean up cache after request completes (success or failure)
  requestPromise.finally(() => {
    requestCache.delete(cacheKey);
  });

  return requestPromise;
};

export const deleteJoystick = async (id: string) => {
  try {
    const response = await activitiesHttp.delete(`/joysticks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchJoystick = async (id: string, joystickData: Partial<Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'>>) => {
  try {
    const response = await activitiesHttp.patch(`/joysticks/${id}`, joystickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJoystick = async (id: string, joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'>) => {
  try {
    const response = await activitiesHttp.put(`/joysticks/${id}`, joystickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

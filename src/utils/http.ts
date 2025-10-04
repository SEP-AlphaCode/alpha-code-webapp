import { apiActivitiesUrl, apiCoursesUrl, apiPythonUrl, apiRobotsUrl, apiSpringUrl, apiUsersUrl } from '@/app/constants/constants'
import axios, { AxiosInstance } from 'axios'
import { refreshToken as callRefreshToken } from "@/features/auth/api/auth-api";

class Http {
  instance: AxiosInstance

  constructor(apiUrl: string) {
    this.instance = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor - Automatically add token to all requests
    this.instance.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('accessToken')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    
    // Response interceptor with auto token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error and we have a refresh token
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          sessionStorage.getItem('refreshToken') &&
          !originalRequest.url?.includes('refresh-new-token') // Avoid infinite loop for refresh token endpoint
        ) {
          originalRequest._retry = true;

          try {
            const res = await callRefreshToken();
            sessionStorage.setItem('accessToken', res.accessToken);
            sessionStorage.setItem('refreshToken', res.refreshToken);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            // If refresh token fails, clear storage and redirect to login
            sessionStorage.clear();
            console.error("Refresh token failed:", refreshError);
            
            // Only redirect if we're not already on login page
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          }
        }

        // If error is 401 and no refresh token available, redirect to login
        if (error.response?.status === 401 && !sessionStorage.getItem('refreshToken')) {
          sessionStorage.clear();
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    )
  }
}

export const springHttp = new Http(apiSpringUrl).instance
export const pythonHttp = new Http(apiPythonUrl).instance
export const coursesHttp = new Http(apiCoursesUrl).instance
export const usersHttp = new Http(apiUsersUrl).instance
export const activitiesHttp = new Http(apiActivitiesUrl).instance
export const robotsHttp = new Http(apiRobotsUrl).instance

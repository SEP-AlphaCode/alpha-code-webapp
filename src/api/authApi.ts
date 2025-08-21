import http from '@/utils/http';
import { LoginRequest, LoginResponse } from '@/types/login';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('Login request data:', data);
    const response = await http.post('/auth/login', data);
    
    // Debug: Log the entire response structure
    console.log('Full login response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
    
    // Handle different response structures
    let responseData = response.data;
    
    // If the data is wrapped in another property, unwrap it
    if (responseData && responseData.data) {
      console.log('Found data in responseData.data');
      responseData = responseData.data;
    }
    
    // If the response is wrapped in a result property
    if (responseData && responseData.result) {
      console.log('Found data in responseData.result');
      responseData = responseData.result;
    }
    
    // Check for common API response patterns
    if (responseData && responseData.success && responseData.payload) {
      console.log('Found data in responseData.payload');
      responseData = responseData.payload;
    }
    
    // Check if response has token and account
    if (!responseData || typeof responseData !== 'object') {
      console.error('Invalid response data structure:', responseData);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Final processed responseData:', responseData);
    return responseData;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const refreshTokenValue = sessionStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response = await http.post('/auth/refresh-token', {
      refreshToken: refreshTokenValue
    });

    // Handle different response structures
    let responseData = response.data;
    
    if (responseData && responseData.data) {
      responseData = responseData.data;
    }
    
    if (responseData && responseData.result) {
      responseData = responseData.result;
    }

    return {
      accessToken: responseData.accessToken || responseData.token,
      refreshToken: responseData.refreshToken
    };
  } catch (error) {
    console.error('Refresh token API error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Since there's no logout API endpoint, we only clear local storage
    // In a real application, you might want to invalidate the token on the server
    console.log('Logging out user - clearing local session data');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear all tokens from sessionStorage
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('account');
    console.log('Session data cleared successfully');
  }
};
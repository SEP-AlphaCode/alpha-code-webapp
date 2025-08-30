import http from '@/utils/http';
import { LoginRequest, TokenResponse } from '@/types/login';
// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  try {
    const response = await http.post('/auth/login', data);
    // Handle different response structures
    let responseData = response.data;
    // If the data is wrapped in another property, unwrap it
    if (responseData && responseData.data) {
      responseData = responseData.data;
    }
    // If the response is wrapped in a result property
    if (responseData && responseData.result) {
      responseData = responseData.result;
    }
    // Check for common API response patterns
    if (responseData && responseData.success && responseData.payload) {
      responseData = responseData.payload;
    }
    // Check if response has token and account
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('Invalid response format from server');
    }
    return responseData;
  } catch (error) {
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
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = sessionStorage.getItem('refreshToken');
    await http.post('/auth/logout', token, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (idToken: string): Promise<TokenResponse> => {
  try {
    const response = await http.post('/auth/google-login', idToken, {
      headers: { "Content-Type": "text/plain" }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
import { LoginRequest, TokenResponse } from '@/types/login';
import { springHttp } from '@/utils/http';
import axios from 'axios';

// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  try {
    const response = await springHttp.post('/auth/login', data);
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

    // Use http instance (be careful about interceptor loops)
    const response = await springHttp.post('/auth/refresh-new-token', refreshTokenValue, {
    headers: { 'Content-Type': 'text/plain' }
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
    await springHttp.post('/auth/logout', token, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (idToken: string): Promise<TokenResponse> => {
  try {
    const response = await springHttp.post('/auth/google-login', idToken, {
      headers: { "Content-Type": "text/plain" }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const requestResetPassword = async (email: string) => {
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address")
    }
    const response = await springHttp.post(`/accounts/reset-password/request`, {
      email,
    });
    return response.data;
  } catch (error) {
    let message = "Request failed!";
    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        message = (error.response.data as { message: string }).message;
      }
      else if (error.response && error.response.status >= 500) {
        message = "Server error. Please try again later.";
      }
    }
    throw new Error(message);
  }
};

export const resetPassword = async (resetToken: string, newPassword: string) => {
  try {
    const response = await springHttp.post(`/accounts/reset-password/reset`, {
      resetToken,
      newPassword,
    });
    return response.data;
  } catch (error) {
    let message = "Request failed!";
    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        message = (error.response.data as { message: string }).message;
      }
      else if (error.response && error.response.status >= 500) {
        message = "Server error. Please try again later.";
      }
    }
    throw new Error(message);
  }
};
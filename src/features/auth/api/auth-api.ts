import { LoginRequest, TokenResponse, LoginWithProfileResponse, SwitchProfileResponse } from '@/types/login';
import { usersHttp } from '@/utils/http';
import axios from 'axios';

// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const login = async (data: LoginRequest): Promise<LoginWithProfileResponse> => {
  try {
    const response = await usersHttp.post('/auth/login', data);
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

export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string, key: string }> => {
  try {
    const refreshTokenValue = sessionStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    // Use http instance (be careful about interceptor loops)
    const response = await usersHttp.post('/auth/refresh-new-token', refreshTokenValue, {
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
      refreshToken: responseData.refreshToken,
      key: responseData.key
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = sessionStorage.getItem('refreshToken');
    await usersHttp.post('/auth/logout', token, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (idToken: string): Promise<LoginWithProfileResponse> => {
  try {
    const response = await usersHttp.post('/auth/google-login', idToken, {
      headers: { "Content-Type": "text/plain" }
    });

    const responseData = response.data;

    // Ensure the response includes the `requiresProfile` property
    return {
      ...responseData,
      requiresProfile: responseData.requiresProfile || false, // Default to false if not provided
    };
  } catch (error) {
    throw error;
  }
}

export const requestResetPassword = async (email: string) => {
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address")
    }
    const response = await usersHttp.post(`/auth/reset-password/request`, {
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
    const response = await usersHttp.post(`/auth/reset-password/reset`, {
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

// Switch profile - Chuyển đổi profile và nhận token mới
export const switchProfile = async (
  profileId: string,
  accountId: string,
  passCode: string
): Promise<SwitchProfileResponse> => {
  try {
    // Truyền đủ thông tin theo spec: accountId, passCode, profileId
  const payload: Record<string, unknown> = { profileId };
    if (accountId) payload.accountId = accountId;
    if (passCode !== undefined) payload.passCode = passCode;
    const response = await usersHttp.post('/auth/switch', payload);
    let responseData = response.data;
    // Unwrap response
    if (responseData && responseData.data) {
      responseData = responseData.data;
    }
    if (responseData && responseData.result) {
      responseData = responseData.result;
    }
    return responseData;
  } catch (error) {
    throw error;
  }
};
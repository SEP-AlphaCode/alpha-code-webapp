import { Account } from '@/types/account';
import { PagedResult } from '@/types/page-result';
import http from '@/utils/http';
import axios from 'axios';
export const getAllAccounts = async () => {
  try {
    const response = await http.get<PagedResult<Account>>('/accounts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountById = async (id: string) => {
  const response = await http.get<Account>(`/accounts/${id}`);
  return response.data;
};

export const createAccount = async (accountData: Omit<Account, 'id' | 'createdDate' | 'lastEdited'> & { avatarFile?: File }) => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add all text fields
    formData.append('username', accountData.username);
    formData.append('email', accountData.email);
    formData.append('fullName', accountData.fullName);
    if (accountData.password) {
      formData.append('password', accountData.password);
    }
    formData.append('phone', accountData.phone);
    formData.append('roleId', accountData.roleId);
    formData.append('gender', accountData.gender.toString());
    
    // Add file if present
    if (accountData.avatarFile) {
      formData.append('avatarFile', accountData.avatarFile);
    }
    
    const response = await http.post('/accounts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: unknown) {
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string } } };
      const status = axiosError.response.status;
      const data = axiosError.response.data;
      
      switch (status) {
        case 409:
          // Conflict - usually duplicate username or email
          if (data?.message) {
            throw new Error(`Conflict: ${data.message}`);
          } else {
            throw new Error('Username or email already exists. Please choose different values.');
          }
        case 400:
          // Bad Request - validation errors
          if (data?.message) {
            throw new Error(`Validation Error: ${data.message}`);
          } else {
            throw new Error('Invalid data provided. Please check all fields.');
          }
        case 401:
          throw new Error('Unauthorized. Please login again.');
        case 403:
          throw new Error('Permission denied. You do not have access to create accounts.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(`Error ${status}: ${data?.message || 'Unknown server error'}`);
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const updateAccount = async (id: string, accountData: Partial<Omit<Account, 'id' | 'createdDate'>>) => {
  const response = await http.put(`/accounts/${id}`, accountData);
  return response.data;
};

export const deleteAccount = async (id: string) => {
  const response = await http.delete(`/accounts/${id}`);
  return response.data;
};

export const requestResetPassword = async (email: string) => {
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address")
    }
    const response = await http.post(`/accounts/reset-password/request`, {
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
    const response = await http.post(`/accounts/reset-password/reset`, {
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
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

export const createAccount = async (accountData: Omit<Account, 'id' | 'createdDate' | 'lastEdited'>) => {
  const response = await http.post('/accounts', accountData);
  return response.data;
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
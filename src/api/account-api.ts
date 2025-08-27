import { Account } from '@/types/account';
import http from '@/utils/http';
export const getAllAccounts = async () => {
  try {
    const response = await http.get<Account[]>('/accounts');
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

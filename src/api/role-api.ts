import http from '../utils/http';
import { Role } from '@/types/role';

export const getRoles = async () => {
  const response = await http.get('/roles');
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await http.get(`/roles/${id}`);
  return response.data;
};

export const createRole = async (roleData: Omit<Role, 'id'>) => {
  const response = await http.post('/roles', roleData);
  return response.data;
};

export const updateRole = async (id: string, roleData: Partial<Omit<Role, 'id'>>) => {
  const response = await http.put(`/roles/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await http.delete(`/roles/${id}`);
  return response.data;
};

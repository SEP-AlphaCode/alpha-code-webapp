import { Role } from '@/types/role';
import { springHttp } from '@/utils/http';

export const getRoles = async () => {
  const response = await springHttp.get('/roles');
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await springHttp.get(`/roles/${id}`);
  return response.data;
};

export const createRole = async (roleData: Omit<Role, 'id'>) => {
  const response = await springHttp.post('/roles', roleData);
  return response.data;
};

export const updateRole = async (id: string, roleData: Partial<Omit<Role, 'id'>>) => {
  const response = await springHttp.put(`/roles/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await springHttp.delete(`/roles/${id}`);
  return response.data;
};

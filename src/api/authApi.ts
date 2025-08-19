import http from '@/utils/http';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post('/auth/login', data);
  return response.data;
};

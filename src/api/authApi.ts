import http from '@/utils/http';
import { LoginRequest, LoginResponse } from '@/types/login';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
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
    return responseData;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};
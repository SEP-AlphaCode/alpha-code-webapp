import http from '@/utils/http';
import { LoginRequest, LoginResponse } from '@/types/login';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await http.post('/auth/login', data);
    
    // Log the full response for debugging
    console.log('Full API Response:', response);
    console.log('Response data:', response.data);
    
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
    
    console.log('Final response data:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};
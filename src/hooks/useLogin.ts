import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoginRequest, LoginResponse } from '@/types/login';
import { saveAccountDataFromToken } from '@/utils/roleUtils';

export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      // Check for empty response
      if (!data || Object.keys(data).length === 0) {
        toast.error('Error: Server returned empty response. Please check the API endpoint.');
        return;
      }
      
      // Check if accessToken exists in the response
      const accessToken = data.accessToken;
      if (!accessToken) {
        toast.error('Error: No access token received from server.');
        return;
      }

      // Check if refreshToken exists in the response
      const refreshToken = data.refreshToken;
      if (!refreshToken) {
        toast.error('Error: No refresh token received from server.');
        return;
      }
      // Save tokens to sessionStorage
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      // Extract and save account data from JWT token
      const accountData = saveAccountDataFromToken(accessToken);
      
      if (!accountData) {
        toast.error('Error: Unable to get account information from token');
        return;
      }
      toast.success(`Welcome ${accountData.fullName}! Login successful.`);
      
      // Redirect based on role from account data
      const roleNameLower = accountData.roleName.toLowerCase();
      if (roleNameLower === 'admin') {
        router.push('/admin');
      } else if (roleNameLower === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      
      // Handle network errors
      const err = error as Error & { 
        response?: { 
          status: number; 
          data?: unknown; 
        };
        request?: unknown;
      };
      if (err.response) {
        if (err.response.status === 404) {
          toast.error('API endpoint does not exist. Please check server configuration.');
        } else if (err.response.status === 401) {
          toast.error('Incorrect username or password.');
        } else if (err.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(`API Error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Network error
        toast.error('Unable to connect to server. Please check your network connection.');
      } else {
        // Other error
        toast.error('Login failed. Please check your information again!');
      }
    }
  });
};
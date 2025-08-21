import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoginRequest, LoginResponse } from '@/types/login';
import { getRoleFromToken, getUsernameFromToken, saveAccountDataFromToken } from '@/utils/roleUtils';

export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      // Debug: Log the entire response to see the structure
      console.log('Login response data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', data ? Object.keys(data) : 'null/undefined');
      
      // Check for empty response
      if (!data || Object.keys(data).length === 0) {
        console.error('Received empty response from login API');
        toast.error('Lỗi: Server trả về response rỗng. Vui lòng kiểm tra API endpoint.');
        return;
      }
      
      // Check if accessToken exists in the response
      const accessToken = data.accessToken;
      if (!accessToken) {
        console.error('AccessToken not found in response. Available fields:', Object.keys(data));
        console.error('Full response:', data);
        toast.error('Lỗi: Không nhận được access token từ server.');
        return;
      }

      // Check if refreshToken exists in the response
      const refreshToken = data.refreshToken;
      if (!refreshToken) {
        console.error('RefreshToken not found in response. Available fields:', Object.keys(data));
        console.error('Full response:', data);
        toast.error('Lỗi: Không nhận được refresh token từ server.');
        return;
      }

      console.log('Found accessToken:', accessToken);
      console.log('Found refreshToken:', refreshToken);

      // Lưu tokens vào sessionStorage
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      
      console.log('Tokens saved successfully');
      
      // Extract and save account data from JWT token
      const accountData = saveAccountDataFromToken(accessToken);
      
      if (!accountData) {
        console.error('Failed to extract account data from token');
        toast.error('Lỗi: Không thể lấy thông tin tài khoản từ token');
        return;
      }
      
      console.log('Account data extracted and saved:', accountData);
      
      toast.success(`Chào mừng ${accountData.fullName}! Đăng nhập thành công.`);
      
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
      const err = error as any;
      if (err.response) {
        // Server responded with error status
        console.error('Server error response:', err.response);
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        
        if (err.response.status === 404) {
          toast.error('API endpoint không tồn tại. Vui lòng kiểm tra server configuration.');
        } else if (err.response.status === 401) {
          toast.error('Username hoặc password không đúng.');
        } else if (err.response.status >= 500) {
          toast.error('Lỗi server. Vui lòng thử lại sau.');
        } else {
          toast.error(`Lỗi API: ${err.response.status}`);
        }
      } else if (err.request) {
        // Network error
        console.error('Network error:', err.request);
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Other error
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    }
  });
};
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
        toast.error('Lỗi: Server trả về response rỗng. Vui lòng kiểm tra API endpoint.');
        return;
      }
      
      // Check if accessToken exists in the response
      const accessToken = data.accessToken;
      if (!accessToken) {
        toast.error('Lỗi: Không nhận được access token từ server.');
        return;
      }

      // Check if refreshToken exists in the response
      const refreshToken = data.refreshToken;
      if (!refreshToken) {
        toast.error('Lỗi: Không nhận được refresh token từ server.');
        return;
      }
      // Lưu tokens vào sessionStorage
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      // Extract and save account data from JWT token
      const accountData = saveAccountDataFromToken(accessToken);
      
      if (!accountData) {
        toast.error('Lỗi: Không thể lấy thông tin tài khoản từ token');
        return;
      }
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
      const err = error as Error & { 
        response?: { 
          status: number; 
          data?: unknown; 
        };
        request?: unknown;
      };
      if (err.response) {
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
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Other error
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    }
  });
};
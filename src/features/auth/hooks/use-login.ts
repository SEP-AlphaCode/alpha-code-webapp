import { useMutation } from '@tanstack/react-query';
import { login, googleLogin } from '@/features/auth/api/auth-api';
import { useRouter } from 'next/navigation';
import { LoginRequest, TokenResponse } from '@/types/login';
import { getTokenPayload } from '@/utils/tokenUtils';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();

  return useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: async (data) => {
      // Check for empty response
      if (!data || Object.keys(data).length === 0) {
        toast.error('Lỗi: Máy chủ trả về phản hồi trống. Vui lòng kiểm tra API endpoint.');
        return;
      }
      
      // Check if accessToken exists in the response
      const accessToken = data.accessToken;
      if (!accessToken) {
        toast.error('Lỗi: Không nhận được access token từ máy chủ.');
        return;
      }

      // Check if refreshToken exists in the response
      const refreshToken = data.refreshToken;
      if (!refreshToken) {
        toast.error('Lỗi: Không nhận được refresh token từ máy chủ.');
        return;
      }
      // Save tokens to sessionStorage
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);

      const accountData = getTokenPayload(accessToken);
      
      if (!accountData) {
        toast.error('Lỗi: Không thể lấy thông tin tài khoản từ token');
        return;
      }
      toast.success(`Chào mừng ${accountData.fullName}!`);
      
      // Redirect based on role from account data
      const roleNameLower = accountData.roleName.toLowerCase();
      if (roleNameLower === 'admin') {
        router.push('/admin');
      } else if (roleNameLower === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/courses');
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
          toast.error('API endpoint không tồn tại. Vui lòng kiểm tra cấu hình máy chủ.');
        } else if (err.response.status === 401) {
          toast.error('Tên đăng nhập hoặc mật khẩu không chính xác.');
        } else if (err.response.status >= 500) {
          toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
        } else {
          toast.error(`Lỗi API: ${err.response.status}`);
        }
      } else if (err.request) {
        // Network error
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Other error
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    }
  });
};

export const useGoogleLogin = () => {
  const router = useRouter();

  return useMutation<TokenResponse, Error, string>({
    mutationFn: googleLogin, // Nhận vào idToken (string)
    onSuccess: (data) => {
      if (!data || Object.keys(data).length === 0) {
        toast.error('Lỗi: Máy chủ trả về phản hồi trống. Vui lòng kiểm tra API endpoint.');
        return;
      }
      const accessToken = data.accessToken;
      if (!accessToken) {
        toast.error('Lỗi: Không nhận được access token từ máy chủ.');
        return;
      }
      const refreshToken = data.refreshToken;
      if (!refreshToken) {
        toast.error('Lỗi: Không nhận được refresh token từ máy chủ.');
        return;
      }
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);

      const accountData = getTokenPayload(accessToken);

      if (!accountData) {
        toast.error('Lỗi: Không thể lấy thông tin tài khoản từ token');
        return;
      }
      toast.success(`Chào mừng ${accountData.fullName}! Đăng nhập thành công.`);
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
      toast.error(error.message || 'Đăng nhập Google thất bại');
    }
  });
};
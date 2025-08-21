import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoginRequest, LoginResponse } from '@/types/login';
export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      // Debug: Log the entire response to see the structure
      console.log('Login response data:', data);
      
      // Check if token exists in the response
      if (!data || !data.token) {
        console.error('Token not found in response:', data);
        toast.error('Lỗi: Không nhận được token từ server');
        return;
      }

      // Check if account exists in the response
      if (!data.account) {
        console.error('Account data not found in response:', data);
        toast.error('Lỗi: Không nhận được thông tin tài khoản');
        return;
      }

      // Lưu token vào sessionStorage
      sessionStorage.setItem('accessToken', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.account));
      
      toast.success('Đăng nhập thành công!');
      
      // Redirect dựa trên role
      const roleName = data.account.roleName?.toLowerCase();
      if (roleName === 'admin') {
        router.push('/admin');
      } else if (roleName === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    }
  });
};
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Đăng xuất thành công!');
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if there's an error, the logout function handles cleanup
      // So we can still redirect to login
      toast.success('Đăng xuất thành công!');
      router.push('/login');
    }
  });
};

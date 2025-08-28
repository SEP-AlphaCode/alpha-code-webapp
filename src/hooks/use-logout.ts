import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/auth-api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear tokens and navigate
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      toast.success('Logout successful!');
      router.push('/login');
    },
    onError: () => {
      // Ensure tokens are removed even if API call fails
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      toast.error('Logout failed, but you have been logged out locally.');
      router.push('/login');
    }
  });
};

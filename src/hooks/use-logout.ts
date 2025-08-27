import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/auth-api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logout successful!');
      router.push('/login');
    },
    onError: () => {
      toast.success('Logout successful!');
      router.push('/login');
    }
  });
};

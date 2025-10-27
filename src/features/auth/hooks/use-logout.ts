import { useQueryClient, useMutation } from '@tanstack/react-query';
import { logout } from '@/features/auth/api/auth-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { clearAllRobots } from '@/store/robot-slice';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // Access the shared QueryClient instance
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear tokens and navigate
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      queryClient.invalidateQueries(); // Invalidate all cached queries
      dispatch(clearAllRobots()); // Clear robot state
      toast.success('Đăng xuất thành công!');
      router.push('/login');
    },
    onError: () => {
      // Ensure tokens are removed even if API call fails
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      queryClient.invalidateQueries(); // Invalidate all cached queries
      dispatch(clearAllRobots()); // Clear robot state
      router.push('/login');
    }
  });
};

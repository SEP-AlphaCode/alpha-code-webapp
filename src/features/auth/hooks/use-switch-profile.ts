import { useMutation } from '@tanstack/react-query';
import { switchProfile } from '@/features/auth/api/auth-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SwitchProfileResponse } from '@/types/login';
import { getTokenPayload } from '@/utils/tokenUtils';

export const useSwitchProfile = () => {
  const router = useRouter();
  
  return useMutation<SwitchProfileResponse, Error, { profileId: string; accountId: string; passCode: number }>({
    mutationFn: ({ profileId, accountId, passCode }) => switchProfile(profileId, accountId, passCode),
    onSuccess: (data) => {
      console.log('SwitchProfileResponse:', data);
      // Lưu token mới
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);

      // Lưu thông tin profile hiện tại nếu có
      if (data.profile) {
        sessionStorage.setItem('currentProfile', JSON.stringify(data.profile));
        toast.success(`Chào ${data.profile.name}!`);
      } else {
        toast.success('Chuyển profile thành công!');
      }

      // Xóa dữ liệu tạm thời
      sessionStorage.removeItem('availableProfiles');
      sessionStorage.removeItem('pendingAccountId');

      // Determine redirect based on roleName inside the returned access token
      try {
        const accountData = getTokenPayload(data.accessToken);
        const roleNameLower = accountData?.roleName?.toLowerCase();
        if (roleNameLower === 'admin') {
          router.push('/admin');
        } else if (roleNameLower === 'staff') {
          router.push('/staff');
        } else if (roleNameLower === 'parent'|| roleNameLower === 'user') {
          router.push('/parent');
        } else if (roleNameLower === 'children') {
          router.push('/children');
        } else {
          // default to /user for unknown or new user-like roles
          router.push('/');
        }
      } catch (err) {
        console.error('Error determining redirect after switchProfile:', err);
        router.push('/user');
      }
    },
    onError: (error) => {
      console.error('Switch profile error:', error);
      toast.error('Không thể chuyển profile. Vui lòng thử lại.');
    }
  });
};

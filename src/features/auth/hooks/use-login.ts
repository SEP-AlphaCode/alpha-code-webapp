import { useMutation } from '@tanstack/react-query';
import { login, googleLogin } from '@/features/auth/api/auth-api';
import { useRouter } from 'next/navigation';
import { LoginRequest, TokenResponse, LoginWithProfileResponse } from '@/types/login';
import { getTokenPayload } from '@/utils/tokenUtils';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginWithProfileResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: async (data) => {
      // Check for empty response
      if (!data || Object.keys(data).length === 0) {
        toast.error('Lỗi: Máy chủ trả về phản hồi trống. Vui lòng kiểm tra API endpoint.');
        return;
      }
      
      // TH1: Admin/Staff - có token ngay (không cần profile)
      if (data.accessToken && data.refreshToken && !data.requiresProfile) {
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
        
        const accountData = getTokenPayload(data.accessToken);
        if (!accountData) {
          toast.error('Lỗi: Không thể lấy thông tin tài khoản từ token');
          return;
        }
        
        toast.success(`Chào mừng ${accountData.fullName}!`);
        
        const roleNameLower = accountData.roleName.toLowerCase();
        if (roleNameLower === 'admin') {
          router.push('/admin');
        } else if (roleNameLower === 'staff') {
          router.push('/staff');
        } else if (roleNameLower === 'parent') {
          router.push('/parent');
        } else if (roleNameLower === 'children') {
          router.push('/children');
        } else {
          // fallback for other roles
          router.push('/');
        }
        return;
      }
      
      // TH2: User - cần xử lý profile
      if (data.requiresProfile) {
        console.log('🔍 Debug - Login response with requiresProfile:', data);
        
        // Lưu accountId để dùng khi tạo profile
        // Backend có thể trả về accountId (camelCase) hoặc accountid (lowercase)
        let accountIdToSave = data.accountId || data.accountid;
        
        if (!accountIdToSave && data.accessToken) {
          const accountData = getTokenPayload(data.accessToken);
          if (accountData?.id) {
            accountIdToSave = accountData.id;
            console.log('🔍 Got accountId from token payload:', accountIdToSave);
          }
        }
        
        if (accountIdToSave) {
          sessionStorage.setItem('pendingAccountId', accountIdToSave);
          console.log('💾 Saved pendingAccountId to sessionStorage:', accountIdToSave);
        } else {
          console.warn('⚠️ No accountId available from backend or token');
        }
        
        // TH2.1: Chưa có profile → Tạo profile Parent
        if (!data.profiles || data.profiles.length === 0) {
          toast.info('Vui lòng tạo profile để tiếp tục');
          router.push('/create-parent-profile');
          return;
        }
        
        // TH2.2: Đã có profile → Chọn profile
        // Lưu tạm danh sách profiles vào sessionStorage
        sessionStorage.setItem('availableProfiles', JSON.stringify(data.profiles));
        router.push('/select-profile');
        return;
      }
      
      // Trường hợp không rõ ràng
      toast.error('Phản hồi từ server không hợp lệ');
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
      } else if (roleNameLower === 'user') {
        router.push('/user');
      } else if (roleNameLower === 'staff') {
        router.push('/staff');
      } else {
        router.push('/student');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng nhập Google thất bại');
    }
  });
};
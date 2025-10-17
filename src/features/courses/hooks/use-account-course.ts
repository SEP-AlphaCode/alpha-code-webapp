import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createAccountCourse,
  getAccountCoursesByAccountId,
  createAccountCoursesFromBundle,
  deleteAccountCourse,
  getAccountCourseById
} from '@/features/courses/api/account-course-api';
import { AccountCourse } from '@/types/accountCourse';
import { toast } from 'sonner';

// GET /api/v1/account-courses/by-account/{accountId} - Get list of account courses by account id
export const useAccountCoursesByAccountId = (accountId: string) => {
  return useQuery({
    queryKey: ['account-courses', 'by-account', accountId],
    queryFn: ({ signal }) => getAccountCoursesByAccountId(accountId, signal),
    enabled: !!accountId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === 'object') {
        const errorObj = error as { name?: string; code?: string };
        if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
          return false;
        }
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// GET /api/v1/account-courses/{id} - Get account course by id
export const useAccountCourseById = (id: string) => {
  return useQuery({
    queryKey: ['account-courses', id],
    queryFn: () => getAccountCourseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// POST /api/v1/account-courses - Create new account course
export const useCreateAccountCourse = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: createAccountCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['account-courses'] });
      queryClient.invalidateQueries({ queryKey: ['account-courses', 'by-account', data.accountId] });
      if (showToast) {
        toast.success('Đăng ký khóa học thành công!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Có lỗi xảy ra khi đăng ký khóa học';
        toast.error(errorMessage);
      }
    },
  });
};

// POST /api/v1/account-courses/from-bundle - Create new account courses from bundle
export const useCreateAccountCoursesFromBundle = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: createAccountCoursesFromBundle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['account-courses'] });
      // Invalidate for the specific account
      if (data && data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['account-courses', 'by-account', data[0].accountId] });
      }
      if (showToast) {
        toast.success('Đăng ký gói khóa học thành công!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Có lỗi xảy ra khi đăng ký gói khóa học';
        toast.error(errorMessage);
      }
    },
  });
};

// DELETE /api/v1/account-courses/{id} - Delete account course
export const useDeleteAccountCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-courses'] });
      toast.success('Hủy đăng ký khóa học thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Có lỗi xảy ra khi hủy đăng ký khóa học';
      toast.error(errorMessage);
    },
  });
};

// Main account course hook that returns all hooks
export const useAccountCourse = () => {
  return {
    useAccountCoursesByAccountId,
    useAccountCourseById,
    useCreateAccountCourse,
    useCreateAccountCoursesFromBundle,
    useDeleteAccountCourse,
  };
};

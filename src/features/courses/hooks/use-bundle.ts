import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getBundles, 
  getNoneDeleteBundles,
  getBundleById, 
  getActiveBundleById,
  createBundle, 
  updateBundle, 
  patchBundle,
  deleteBundle 
} from '@/features/courses/api/bundles-api';
import { Bundle } from '@/types/bundle';
import { toast } from 'sonner';

// GET /api/v1/bundles - Get all active bundles with pagination and optional search
export const useBundles = (
  page: number = 1,
  size: number = 10,
  search?: string
) => {
  return useQuery({
    queryKey: ['bundles', page, size, search || ''],
    queryFn: ({ signal }) => getBundles(page, size, search, signal),
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

// GET /api/v1/bundles/get-none-delete - Get all none delete bundles with pagination and optional search
export const useNoneDeleteBundles = (
  page: number = 1,
  size: number = 10,
  search?: string
) => {
  return useQuery({
    queryKey: ['bundles', 'none-delete', page, size, search || ''],
    queryFn: ({ signal }) => getNoneDeleteBundles(page, size, search, signal),
    staleTime: 1000 * 60 * 2,
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

// GET /api/v1/bundles/{id} - Get bundle by id
export const useBundleById = (id: string) => {
  return useQuery({
    queryKey: ['bundles', id],
    queryFn: () => getBundleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// GET /api/v1/bundles/active/{id} - Get active bundle by id
export const useActiveBundle = (id: string) => {
  return useQuery({
    queryKey: ['bundles', 'active', id],
    queryFn: () => getActiveBundleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// POST /api/v1/bundles - Create new bundle
export const useCreateBundle = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: createBundle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      if (showToast) {
        toast.success('Tạo gói khóa học thành công!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Có lỗi xảy ra khi tạo gói khóa học';
        toast.error(errorMessage);
      }
    },
  });
};

// PUT /api/v1/bundles/{id} - Update bundle by id
export const useUpdateBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bundle> }) => 
      updateBundle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles', variables.id] });
      toast.success('Cập nhật gói khóa học thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Có lỗi xảy ra khi cập nhật gói khóa học';
      toast.error(errorMessage);
    },
  });
};

// PATCH /api/v1/bundles/{id} - Patch bundle by id
export const usePatchBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bundle> }) => 
      patchBundle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles', variables.id] });
      toast.success('Cập nhật gói khóa học thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Có lỗi xảy ra khi cập nhật gói khóa học';
      toast.error(errorMessage);
    },
  });
};

// DELETE /api/v1/bundles/{id} - Delete bundle by id
export const useDeleteBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBundle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Xóa gói khóa học thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Có lỗi xảy ra khi xóa gói khóa học';
      toast.error(errorMessage);
    },
  });
};

// Main bundle hook that returns all hooks
export const useBundle = () => {
  return {
    useBundles,
    useNoneDeleteBundles,
    useBundleById,
    useActiveBundle,
    useCreateBundle,
    useUpdateBundle,
    usePatchBundle,
    useDeleteBundle,
  };
};

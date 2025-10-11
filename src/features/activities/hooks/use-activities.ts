import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllActivities, 
  getPagedActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity 
} from '@/features/activities/api/activities-api';
import { Activity } from '@/types/activities';
import { toast } from 'sonner';

export const useActivities = (page: number = 1, size: number = 10, search?: string) => {
  return useQuery({
    queryKey: ['activities', page, size, search || ''],
    queryFn: ({ signal }) => getPagedActivities(page, size, search, signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Only refetch if data is stale
    retry: (failureCount, error: unknown) => {
      // Don't retry on canceled errors
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

export const useAllActivities = () => {
  return useQuery({
    queryKey: ['activities', 'all'],
    queryFn: getAllActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ['activities', id],
    queryFn: () => getActivityById(id),
    enabled: !!id,
  });
};

export const useCreateActivity = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      if (showToast) {
        toast.success('Activity created successfully!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Failed to create activity';
        toast.error(errorMessage);
      }
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Activity> }) => 
      updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity updated successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Failed to update activity';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity deleted successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Failed to delete activity';
      toast.error(errorMessage);
    },
  });
};
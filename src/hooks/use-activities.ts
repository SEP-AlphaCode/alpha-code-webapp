import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllActivities, 
  getPagedActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity 
} from '@/api/activities-api';
import { Activity } from '@/types/activities';
import { toast } from 'sonner';

export const useActivities = (page: number = 1, size: number = 10, search?: string) => {
  return useQuery({
    queryKey: ['activities', page, size, search],
    queryFn: ({ signal }) => getPagedActivities(page, size, search, signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on canceled errors
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return false;
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

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create activity');
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
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update activity');
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
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete activity');
    },
  });
};
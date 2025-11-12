import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification 
} from '../api/notification-api';
import { toast } from 'sonner';

// Hook to get notifications with pagination
export const useNotifications = (params: {
  page?: number;
  size?: number;
  accountId?: string;
  status?: number;
}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
    enabled: !!params.accountId,
  });
};

// Hook to mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Không thể đánh dấu đã đọc';
      toast.error(errorMessage);
    },
  });
};

// Hook to delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      toast.success('Đã xóa thông báo');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Không thể xóa thông báo';
      toast.error(errorMessage);
    },
  });
};

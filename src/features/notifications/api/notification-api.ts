import { Notification } from '@/types/notification';
import { usersHttp } from '@/utils/http';

export interface PagedNotifications {
  content: Notification[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// GET /api/v1/notifications - Get all notifications with pagination
export const getNotifications = async (params: {
  page?: number;
  size?: number;
  accountId?: string;
  status?: number;
}): Promise<PagedNotifications> => {
  const response = await usersHttp.get<PagedNotifications>('/notifications', { params });
  return response.data;
};

// GET /api/v1/notifications/{id} - Get notification by id
export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await usersHttp.get<Notification>(`/notifications/${id}`);
  return response.data;
};

// PATCH /api/v1/notifications/{id}/read - Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const response = await usersHttp.patch<Notification>(`/notifications/${id}/read`);
  return response.data;
};

// DELETE /api/v1/notifications/{id} - Delete notification
export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await usersHttp.delete<{ message: string }>(`/notifications/${id}`);
  return response.data;
};

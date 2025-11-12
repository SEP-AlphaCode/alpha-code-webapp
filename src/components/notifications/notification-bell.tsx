"use client";

import React, { useState, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useNotificationWebSocket } from "@/features/notifications/hooks/use-notification-websocket";
import { NotificationStatus } from "@/types/notification";
import { NotificationList } from "./notification-list";

interface NotificationBellProps {
  accountId: string | null;
}

export function NotificationBell({ accountId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const { data: notificationsData, refetch } = useNotifications({
    page: 1,
    size: 20,
    accountId: accountId || undefined,
    status: undefined, // Get both read and unread
  });

  // ✅ Refetch khi mở popup để có data mới nhất
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      console.log("📂 Opening notifications popup, refetching...");
      refetch();
    }
  }, [refetch]);

  // ✅ Memoize callback để tránh re-render vô tận
  const handleNewNotification = useCallback(() => {
    console.log("🔔 New notification arrived, refetching list...");
    refetch(); // Refetch để lấy notification mới nhất
  }, [refetch]);

  // Setup WebSocket to receive real-time notifications
  useNotificationWebSocket({
    accountId,
    onNotificationReceived: handleNewNotification,
  });

  // Count unread notifications
  const unreadCount = notificationsData?.content?.filter(
    (n) => n.status === NotificationStatus.UNREAD
  ).length || 0;

  if (!accountId) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <NotificationList
          notifications={notificationsData?.content || []}
          accountId={accountId || undefined}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

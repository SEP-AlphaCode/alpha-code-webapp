"use client";

import React from "react";
import { Notification } from "@/types/notification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: Notification[];
  onClose: () => void;
}

export function NotificationList({ notifications, onClose }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Không có thông báo nào</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Thông báo</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

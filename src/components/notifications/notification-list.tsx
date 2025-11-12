"use client";

import React from "react";
import Image from "next/image";
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
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Image
          src="/ic_msg_default.webp"
          alt="No notifications"
          width={120}
          height={120}
          className="mb-4 opacity-50"
        />
        <p className="text-sm text-gray-500">Bạn chưa có thông báo nào</p>
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

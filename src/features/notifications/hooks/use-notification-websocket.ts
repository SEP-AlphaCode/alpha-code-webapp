import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Notification } from '@/types/notification';
import { toast } from 'sonner';
import { userServiceSocketUrl } from '@/app/constants/constants';

interface UseNotificationWebSocketProps {
  accountId: string | null;
  onNotificationReceived?: (notification: Notification) => void;
}

export const useNotificationWebSocket = ({ 
  accountId, 
  onNotificationReceived 
}: UseNotificationWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!accountId) {
      console.log('❌ No accountId provided, skipping WebSocket connection');
      return;
    }

    console.log('🔌 Initializing WebSocket connection for accountId:', accountId);

    // Initialize STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS(`${userServiceSocketUrl}`) as WebSocket,
      debug: (str: string) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ WebSocket Connected!');
        setIsConnected(true);

        // Subscribe to user-specific notification topic
        const subscription = client.subscribe(
          `/topic/notifications/${accountId}`,
          (message: IMessage) => {
            try {
              const notification: Notification = JSON.parse(message.body);
              console.log('📬 Received notification:', notification);

              // Show toast notification
              toast.success(notification.title, {
                description: notification.message,
              });

              // Call callback if provided
              if (onNotificationReceived) {
                onNotificationReceived(notification);
              }
            } catch (error) {
              console.error('❌ Error parsing notification:', error);
            }
          }
        );

        console.log('📡 Subscribed to topic:', `/topic/notifications/${accountId}`);

        // Store subscription for cleanup
        clientRef.current = client;
      },
      onDisconnect: () => {
        console.log('❌ WebSocket Disconnected');
        setIsConnected(false);
      },
      onStompError: (frame: unknown) => {
        console.error('❌ STOMP Error:', frame);
        setIsConnected(false);
      },
    });

    // Activate connection
    client.activate();

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [accountId, onNotificationReceived]);

  return { isConnected };
};

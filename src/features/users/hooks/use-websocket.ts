import { useMutation } from '@tanstack/react-query';
import { sendRobotCommand } from '@/features/users/api/websocket-api';
import { WebSocketCommand } from '@/types/websocket';
import { toast } from 'sonner';

// Hook to send robot command
export const useSendRobotCommand = () => {
  return useMutation({
    mutationFn: ({ serial, command }: { serial: string; command: WebSocketCommand }) => 
      sendRobotCommand(serial, command),
    onSuccess: (data) => {
      toast.success(data.message || 'Lệnh đã gửi thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Không thể gửi lệnh đến robot';
      toast.error(errorMessage);
    },
  });
};

// Hook for robot controls (wrapper for easier use)
export const useRobotControls = () => {
  const sendCommand = useSendRobotCommand();
  
  const startActivity = (serial: string, type: string, data: unknown) => {
    const command = {
      type: type,
      data: data // Gửi trực tiếp data object thay vì array
    };
    
    console.log('Sending robot command:', {
      serial,
      command
    });
    
    sendCommand.mutate({
      serial,
      command
    });
  };

  return {
    startActivity,
    isLoading: sendCommand.isPending,
    error: sendCommand.error
  };
};
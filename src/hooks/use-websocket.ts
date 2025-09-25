import { useMutation } from '@tanstack/react-query';
import { sendRobotCommand } from '@/api/websocket-api';
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
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể gửi lệnh đến robot');
    },
  });
};

// Hook for robot controls (wrapper for easier use)
export const useRobotControls = () => {
  const sendCommand = useSendRobotCommand();
  
  const startActivity = (serial: string, type: string, data: any) => {
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
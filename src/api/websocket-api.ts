import { pythonHttp } from '@/utils/http';
import { WebSocketCommand } from '@/types/websocket';

// POST /websocket/command/{serial} - Send Command to Robot
export const sendRobotCommand = async (serial: string, command: WebSocketCommand): Promise<{ message: string }> => {
  try {
    console.log('API Request:', {
      url: `/websocket/command/${serial}`,
      method: 'POST',
      data: command
    });
    
    const response = await pythonHttp.post<{ message: string }>(`/websocket/command/${serial}`, command);
    
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending robot command:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    throw error;
  }
};
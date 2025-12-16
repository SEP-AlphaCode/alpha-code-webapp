import { useState, useEffect, useCallback } from 'react';
import { getTaskStatus } from '@/features/users/api/music-api';
import { TaskProgress } from '@/types/music';

interface UseTaskProgressOptions {
  taskId: string | null;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  pollingInterval?: number; // in milliseconds
}

export const useTaskProgress = ({
  taskId,
  onComplete,
  onError,
  pollingInterval = 2000, // Poll every 2 seconds
}: UseTaskProgressOptions) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<TaskProgress['status'] | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const pollProgress = useCallback(async () => {
    if (!taskId) return;

    try {
      const progressData = await getTaskStatus(taskId);
      
      setProgress(progressData.progress);
      setStatus(progressData.status);
      setMessage(progressData.message || '');

      if (progressData.status === 'completed') {
        setIsPolling(false);
        if (onComplete && progressData.result) {
          onComplete(progressData.result);
        }
      } else if (progressData.status === 'failed') {
        setIsPolling(false);
        if (onError) {
          onError(progressData.error || 'Task failed');
        }
      }
    } catch (error) {
      console.error('Error polling progress:', error);
      setIsPolling(false);
      if (onError) {
        onError('Không thể kiểm tra tiến trình');
      }
    }
  }, [taskId, onComplete, onError]);

  useEffect(() => {
    if (taskId && isPolling) {
      const interval = setInterval(pollProgress, pollingInterval);
      
      // Initial poll immediately
      pollProgress();

      return () => clearInterval(interval);
    }
  }, [taskId, isPolling, pollingInterval, pollProgress]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setStatus(null);
    setMessage('');
    setIsPolling(false);
  }, []);

  return {
    progress,
    status,
    message,
    isPolling,
    startPolling,
    stopPolling,
    reset,
  };
};

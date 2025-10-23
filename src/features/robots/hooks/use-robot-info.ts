// src/features/robots/hooks/useRobotInfo.ts
import { useQuery, useQueries } from "@tanstack/react-query";
import { getRobotInfo } from "@/features/robots/api/robot_info_api";
import { RobotInfoResponse } from "@/types/robot-info";

export const useRobotInfo = () => {
  const useGetRobotInfo = (
    serial: string,
    timeout: number = 10,
    options: { enabled?: boolean } = {}
  ) => {
    return useQuery<RobotInfoResponse>({
      queryKey: ["robot-info", serial, timeout],
      queryFn: () => getRobotInfo(serial, timeout),
      enabled: options.enabled !== false && !!serial,
      retry: 2,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 2,
    });
  };

  const useGetMultipleRobotInfo = (
    serials: string[],
    timeout: number = 10,
    options: { enabled?: boolean } = {}
  ) => {
    const results = useQueries({
      queries: serials.map((serial) => ({
        queryKey: ["robot-info", serial, timeout],
        queryFn: () => getRobotInfo(serial, timeout),
        enabled: options.enabled !== false && !!serial,
        retry: 1,
        retryDelay: 500,
        staleTime: 1000 * 30,
      })),
    });

    // Chuẩn hóa kết quả
    return results.map((r, idx) => ({
      serial: serials[idx],
      data: r.data,
      isLoading: r.isLoading,
      isError: r.isError,
      error: r.error,
      status:
        r.isError || r.data?.status === "error"
          ? "offline"
          : "online",
    }));
  };

  return {
    useGetRobotInfo,
    useGetMultipleRobotInfo,
  };
};

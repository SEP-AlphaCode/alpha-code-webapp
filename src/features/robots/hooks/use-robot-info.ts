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
    serials: string[], // Mảng serials được truyền vào
    // 💡 Đổi tên thành interval để dễ hiểu hơn là timeout của API
    interval: number = 3,
    options: { enabled?: boolean } = {}
  ) => {
    const queries = serials.map((serial) => ({
      queryKey: ["robot-info", serial, 10], // Giữ timeout API là 10s trong key
      // queryFn gọi API với timeout cứng là 10s (có thể chỉnh)
      queryFn: () => getRobotInfo(serial, 10),

      enabled: options.enabled !== false && !!serial,

      // ✅ Kích hoạt Polling: Refetch mỗi 'interval' giây (3000ms)
      refetchInterval: interval * 1000,

      // Cấu hình cache cho việc polling:
      // Dữ liệu được coi là 'stale' ngay lập tức để luôn refetch theo interval
      staleTime: 0,
      // Giảm retry vì polling liên tục
      retry: 1,
      retryDelay: 1000,
    }));

    const results = useQueries({ queries });

    // Chuẩn hóa kết quả - giữ nguyên logic của bạn
    return results.map((r, idx) => {
      const serialFromMap = serials[idx];

      return ({
        serial: serialFromMap,
        data: r.data,
        isLoading: r.isLoading,
        isError: r.isError,
        error: r.error,
        status:
          r.isError || r.data?.status === "error"
            ? "offline"
            : "online",
      });
    });
  };

  return {
    useGetRobotInfo,
    useGetMultipleRobotInfo,
  };
};

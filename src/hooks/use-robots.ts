"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { getPagedRobots } from "@/features/robot/api/robot-api";
import { pythonHttp } from "@/utils/http";

export interface CombinedRobot {
  id: string;
  serialNumber: string;
  modelName: string;
  statusText: string;
  isOnline: boolean;
  battery: number;
  isCharging: boolean;
}

async function fetchRobotStatus(serial: string) {
  const res = await pythonHttp.get("/robot/status", {
    params: { serial_number: serial },
  });
  return res.data;
}

export function useRobots(accountId: string, page = 1, size = 10) {
  // 📦 Lấy danh sách robot từ backend chính
  const { data, isLoading, error } = useQuery({
    queryKey: ["robots", accountId, page, size],
    queryFn: () => getPagedRobots(accountId, page, size),
    enabled: !!accountId,
  });

  const robots = data?.data || [];

  // ⚡ Gọi nhiều API python song song để lấy status từng robot
  const statusQueries = useQueries({
    queries: robots.map((r) => ({
      queryKey: ["robotStatus", r.serialNumber],
      queryFn: () => fetchRobotStatus(r.serialNumber),
      refetchInterval: 5000,
      enabled: !!r.serialNumber,
    })),
  });

  // 🔗 Gộp dữ liệu từ 2 nguồn
  const enrichedRobots: CombinedRobot[] = robots.map((r, index) => {
    const status = statusQueries[index]?.data;
    return {
      id: r.id,
      serialNumber: r.serialNumber,
      modelName: r.robotModelName,
      statusText: r.statusText,
      isOnline: !!status,
      battery: status?.battery_level ?? 0,
      isCharging: status?.is_charging ?? false,
    };
  });

  const isStatusesLoading = statusQueries.some((q) => q.isLoading);

  return {
    robots: enrichedRobots,
    isLoading: isLoading || isStatusesLoading,
    error,
  };
}

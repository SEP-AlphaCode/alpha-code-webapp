// hooks/use-robots-page.ts
import { useQuery } from "@tanstack/react-query";
import { getPagedRobots } from "@/features/robot/api/robot-api";
import { getUserIdFromToken } from "@/utils/tokenUtils";

export function useRobotsPage(page = 1, size = 10) {
  const token = sessionStorage.getItem("accessToken") || "";
  const accountId = getUserIdFromToken(token);

  return useQuery({
    queryKey: ["robots-page", accountId, page, size],
    queryFn: () => getPagedRobots(accountId!, page, size),
    staleTime: Infinity, // Không tự refresh
  });
}

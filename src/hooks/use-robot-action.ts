// src/hooks/use-robot-action.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { springHttp } from "@/utils/http"
import type { RobotAction, RobotActionResponse } from "@/types/robot"

export function useRobotActions(page: number, size: number, search = "") {
  return useQuery<RobotActionResponse, Error>({
    queryKey: ["robotActions", page, size, search],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSize, currentSearch] = queryKey
      const res = await springHttp.get<RobotActionResponse>(
        `/actions?page=${currentPage}&size=${currentSize}&search=${currentSearch}`,
        { headers: { accept: "*/*" } }
      )
      return res.data
    },
    retry: 2,
    retryDelay: 1000,
    placeholderData: (prev) => prev, // giữ data cũ khi chuyển page
  })
}

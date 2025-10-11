// src/hooks/use-robot-dance.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { activitiesHttp } from "@/utils/http"
import type { RobotActionResponse } from "@/types/robot"

export function useDances(page: number, size: number, search = "") {
  return useQuery<RobotActionResponse, Error>({
    queryKey: ["robotDances", page, size, search || ""],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSize, currentSearch] = queryKey

      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)

      const res = await activitiesHttp.get<RobotActionResponse>(
        `/dances?page=${currentPage}&size=${currentSize}&search=${currentSearch}`,
        { signal: controller.signal, headers: { accept: "*/*" } }
      )
      return res.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
    placeholderData: (prev) => prev,
  })
}

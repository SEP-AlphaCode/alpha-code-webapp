// src/hooks/use-robot-dance.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { springHttp } from "@/utils/http"
import type { RobotActionResponse } from "@/types/robot"

export function useDances(page: number, size: number, search = "") {
  return useQuery<RobotActionResponse, Error>({
    queryKey: ["robotDances", page, size, search],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSize, currentSearch] = queryKey

      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)

      const res = await springHttp.get<RobotActionResponse>(
        `/dances?page=${currentPage}&size=${currentSize}&search=${currentSearch}`,
        { signal: controller.signal, headers: { accept: "*/*" } }
      )
      return res.data
    },
    retry: 2,
    retryDelay: 1000,
    placeholderData: (prev) => prev,
  })
}

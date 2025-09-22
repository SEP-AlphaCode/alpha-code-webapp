"use client";

import { useEffect, useState } from "react";
import { springHttp } from "@/utils/http";
import { RobotAction } from "@/types/robot";

// Type cho response của API
interface RobotActionResponse {
  data: RobotAction[];
  page: number;
  total_count: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export function useRobotActions(
  page: number,
  size: number,
  search: string = ""
) {
  const [actions, setActions] = useState<RobotAction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await springHttp.get<RobotActionResponse>(
          `/actions?page=${page}&size=${size}&search=${search}`,
          { headers: { accept: "*/*" } }
        );

        const body = res.data;
        setActions(body.data || []);
        setTotalPages(body.total_pages || 1);
      } catch (err) {
        console.error("❌ Failed to fetch actions", err);
        setError("Không tải được danh sách action");
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [page, size, search]);

  return { actions, totalPages, loading, error };
}


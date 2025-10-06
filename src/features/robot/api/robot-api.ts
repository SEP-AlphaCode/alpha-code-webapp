import { robotsHttp } from "@/utils/http";

export interface RobotResponse {
  id: string;
  serialNumber: string;
  createdDate: string;
  lastUpdated?: string;
  status: number;
  statusText: string;
  accountId: string;
  robotModelId: string;
  robotModelName: string;
}

export interface PagedRobots {
  data: RobotResponse[];
  total_count: number;
  total_pages: number;
}

/**
 * Gọi API lấy danh sách robot của account đang login
 */
export const getPagedRobots = async (
  accountId: string,
  page = 1,
  size = 10
): Promise<PagedRobots> => {
  const res = await robotsHttp.get<PagedRobots>(`/robots`, {
    params: { page, size, accountId },
    headers: { accept: "*/*" },
  });
  return res.data;
};

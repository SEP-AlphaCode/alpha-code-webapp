import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPagedRobotApks,
  getFilePath,
  createRobotApk,
  updateRobotApk,
  deleteRobotApk,
} from "../api/robot-apk-api";
import { PagedResult } from "@/types/page-result";
import {
  CreateRobotApkDto,
  RobotApk,
  UpdateRobotApkDto,
} from "@/types/robot-apk";

/**
 * 🧩 Lấy danh sách Robot APK có phân trang + tìm kiếm
 */
export const usePagedRobotApks = (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal
) =>
  useQuery<PagedResult<RobotApk>, Error>({
    queryKey: ["robot-apks", page, size, search],
    queryFn: () => getPagedRobotApks(page, size, search, signal),
    placeholderData: (previousData) => previousData,
  });

/**
 * 🧩 Lấy đường dẫn file APK
 */
export const useFilePath = (apkId?: string, accountId?: string) =>
  useQuery<string, Error>({
    queryKey: ["robot-apk-file-path", apkId, accountId],
    queryFn: () => getFilePath(apkId!, accountId!),
    enabled: !!apkId && !!accountId,
  });

/**
 * 🟢 Tạo mới Robot APK
 */
export const useCreateRobotApk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { robotApk: CreateRobotApkDto; file: File }) =>
      createRobotApk(params.robotApk, params.file),
    onSuccess: () => {
      // Làm mới toàn bộ danh sách APK (mọi trang/từ khóa)
      queryClient.invalidateQueries({ queryKey: ["robot-apks"] });
    },
  });
};

/**
 * 🟡 Cập nhật Robot APK
 */
export const useUpdateRobotApk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      apkId: string;
      robotApk: UpdateRobotApkDto;
      file?: File;
    }) => updateRobotApk(params.apkId, params.robotApk, params.file),
    onSuccess: (_, variables) => {
      // Làm mới toàn bộ danh sách APK
      queryClient.invalidateQueries({ queryKey: ["robot-apks"] });
      // Invalidate mọi cache file-path của apkId này (bất kể accountId nào)
      queryClient.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "robot-apk-file-path" && q.queryKey[1] === variables.apkId,
      });
    },
  });
};

/**
 * 🔴 Xóa Robot APK theo ID
 */
export const useDeleteRobotApk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apkId: string) => deleteRobotApk(apkId),
    onSuccess: () => {
      // Làm mới toàn bộ danh sách APK
      queryClient.invalidateQueries({ queryKey: ["robot-apks"] });
      // Xóa mọi cache file-path vì apk đã xóa
      queryClient.invalidateQueries({ queryKey: ["robot-apk-file-path"] });
    },
  });
};

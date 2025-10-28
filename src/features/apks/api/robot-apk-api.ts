import { PagedResult } from "@/types/page-result";
import { CreateRobotApkDto, RobotApk, UpdateRobotApkDto } from "@/types/robot-apk";
import { robotsHttp } from "@/utils/http";

export const getPagedRobotApks = async (
    page: number,
    size: number,
    search?: string,
    signal?: AbortSignal,
) => {
    try {
        const response = await robotsHttp.get<PagedResult<RobotApk>>("/robot-apks", {
            params: {
                page,
                size,
                search,
            },
            signal,
        });

        return response.data;
    } catch (error) {
        console.error("API Error in getPagedActions:", error);
        throw error;
    }
};

export const getFilePath = async (apkId: string, accountId: string): Promise<string> => {
    try {
        const response = await robotsHttp.get<string>('/robot-apks/file-path', {
            params: {
                apkId,
                accountId
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("API Error in getFilePath:", error);
        throw error;
    }
}

/**
 * 1. Tạo mới Robot APK (upload file)
 */
export const createRobotApk = async (robotApk: CreateRobotApkDto, file: File): Promise<RobotApk> => {
  try {
    const formData = new FormData();
    formData.append("robotApk", new Blob([JSON.stringify(robotApk)], { type: "application/json" }));
    formData.append("file", file);

    const response = await robotsHttp.post<RobotApk>("/robot-apks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("API Error in createRobotApk:", error);
    throw error;
  }
};

/**
 *  2. Cập nhật Robot APK
 */
export const updateRobotApk = async (apkId: string, robotApk: UpdateRobotApkDto, file?: File): Promise<RobotApk> => {
  try {
    const formData = new FormData();
    formData.append("robotApk", new Blob([JSON.stringify(robotApk)], { type: "application/json" }));
    if (file) formData.append("file", file);

    const response = await robotsHttp.put<RobotApk>(`/robot-apks/${apkId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("API Error in updateRobotApk:", error);
    throw error;
  }
};

/**
 * 3. Xóa Robot APK theo ID
 */
export const deleteRobotApk = async (apkId: string): Promise<void> => {
  try {
    await robotsHttp.delete(`/robot-apks/${apkId}`);
  } catch (error) {
    console.error("API Error in deleteRobotApk:", error);
    throw error;
  }
};
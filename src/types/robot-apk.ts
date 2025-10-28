
export interface RobotApk {
  id: string;
  version: string;
  description: string;
  robotModelId: string;
  robotModelName: string; // backend should include this
  isRequiredLicense: boolean
  createdDate: string;
  status: number;
  lastUpdated?: string;
}

/**
 * DTO cho tạo mới Robot APK (POST)
 */
export interface CreateRobotApkDto {
  version: string;
  description: string;
  robotModelId: string;
  isRequireLicense: boolean;
  file: File;
}

/**
 * DTO cho cập nhật Robot APK (PUT)
 */
export interface UpdateRobotApkDto {
  version?: string;
  description?: string;
  robotModelId?: string;
  isRequireLicense?: boolean;
  status?: number;
  file?: File;
}
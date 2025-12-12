import { robotsHttp, pythonHttp } from "@/utils/http";
import { VideoCaptureResponse, UploadResponse, VideoCapture } from "@/types/magic-sketch";

export const magicSketchApi = {
  // 1. LẤY DANH SÁCH (GALLERY)
  // Sử dụng robotsHttp gọi vào Service quản lý Data
  // Response trả về có dạng { data: [...], page: 1, ... }
  getSketchList: async (accountId: string, page = 1, size = 100): Promise<VideoCaptureResponse> => {
    const response = await robotsHttp.get<VideoCaptureResponse>('/video-captures', {
      params: { 
        accountId, 
        page, 
        size 
      }
    });
    return response.data;
  },

  // 2. UPLOAD ẢNH MỚI
  // Sử dụng pythonHttp để upload file lên S3 và tạo record ban đầu
  uploadCapture: async (file: File, accountId: string, description?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("account_id", accountId);
    // Python service yêu cầu key là 'description' (nếu có)
    if (description) {
      formData.append("description", description);
    }

    const response = await pythonHttp.post("/video/capture/by-account", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 3. TẠO VIDEO (GENERATE) TỪ ID ĐÃ CÓ
  // Gọi vào endpoint generate của robotsHttp
  // Body gửi lên là một JSON String: "description content" (theo curl -d '"test"')
  generateVideoById: async (id: string, description: string): Promise<VideoCapture> => {
    const response = await robotsHttp.post<VideoCapture>(
      `/video-captures/${id}/generate`, 
      JSON.stringify(description), // Quan trọng: Body là chuỗi JSON
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  }
};
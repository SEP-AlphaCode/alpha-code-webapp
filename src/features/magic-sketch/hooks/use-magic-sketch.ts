import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { magicSketchApi } from "../api/magic-sketch-api";

const KEYS = {
  LIST: "sketch-list",
};

// Hook lấy danh sách
export const useGetSketchList = (accountId: string | null) => {
  return useQuery({
    queryKey: [KEYS.LIST, accountId],
    queryFn: () => magicSketchApi.getSketchList(accountId || ""),
    enabled: !!accountId,
    // Tùy chọn: Auto refresh mỗi 5s nếu bạn muốn cập nhật trạng thái video (mặc dù flow này là đồng bộ)
    // refetchInterval: 5000, 
  });
};

// Hook Upload ảnh mới
export const useUploadCapture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, accountId, description }: { file: File; accountId: string; description?: string }) =>
      magicSketchApi.uploadCapture(file, accountId, description),
    onSuccess: () => {
      // Refresh list ngay sau khi upload xong để hiện ảnh mới
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
  });
};

// Hook Generate Video
export const useGenerateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) => 
      magicSketchApi.generateVideoById(id, description),
    onSuccess: () => {
      // Refresh list để cập nhật videoUrl và isCreated mới nhận được
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
  });
};
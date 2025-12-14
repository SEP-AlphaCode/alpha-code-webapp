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
    
    // FIX QUAN TRỌNG: Giữ lại data cũ trong lúc đang fetch data mới
    // Giúp UI không bị nháy loading và không bị văng ra gallery
    placeholderData: (previousData) => previousData, 
  });
};

// Hook Upload ảnh mới
export const useUploadCapture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, accountId, description }: { file: File; accountId: string; description?: string }) =>
      magicSketchApi.uploadCapture(file, accountId, description),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
  });
};
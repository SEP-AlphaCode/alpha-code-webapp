import { createQRCode, getAllQRCodes, getQRCodeById, updateQRCode, deleteQRCode, updateQRCodeStatus } from "@/api/qr-code-api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeRequest, QRCodeResponse } from "@/types/qrcode";

export const useQRCode = () => {
    const queryClient = useQueryClient();

    const useGetAllQRCodes = () => {
        return useQuery<QRCodeResponse[]>({
            queryKey: ["qrcodes"],
            queryFn: getAllQRCodes
        });
    };

    const useGetQRCodeById = (id: string) => {
        return useQuery<QRCodeResponse>({
            queryKey: ["qrcodes", id],
            queryFn: () => getQRCodeById(id)
        });
    };

    const useCreateQRCode = () => {
        return useMutation<QRCodeResponse, Error, QRCodeRequest>({
            mutationFn: createQRCode,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
            }
        });
    };

    const useUpdateQRCode = () => {
        return useMutation<QRCodeResponse, Error, { id: string; data: Partial<QRCodeRequest> }>({
            mutationFn: ({ id, data }) => updateQRCode(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
            }
        });
    };

    const useDeleteQRCode = () => {
        return useMutation<void, Error, string>({
            mutationFn: deleteQRCode,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
            }
        });
    };

    const useUpdateQRCodeStatus = () => {
        return useMutation<QRCodeResponse, Error, { id: string; status: string }>({
            mutationFn: ({ id, status }) => updateQRCodeStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
            }
        });
    };

    return {
        useGetAllQRCodes,
        useGetQRCodeById,
        useCreateQRCode,
        useUpdateQRCode,
        useDeleteQRCode,
        useUpdateQRCodeStatus
    };
};

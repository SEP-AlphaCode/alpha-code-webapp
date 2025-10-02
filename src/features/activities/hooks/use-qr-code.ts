import { createQRCode, getAllQRCodes, getQRCodeById, updateQRCode, deleteQRCode, updateQRCodeStatus } from "@/features/activities/api/qr-code-api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeRequest, QRCodesResponse } from "@/types/qrcode";

export const useQRCode = () => {
    const queryClient = useQueryClient();

    const useGetAllQRCodes = () => {
        return useQuery<QRCodesResponse>({
            queryKey: ["qrcodes"],
            queryFn: getAllQRCodes
        });
    };

    const useGetQRCodeById = (id: string) => {
        return useQuery<QRCodesResponse>({
            queryKey: ["qrcodes", id],
            queryFn: () => getQRCodeById(id)
        });
    };

    const useCreateQRCode = () => {
        return useMutation<QRCodesResponse, Error, QRCodeRequest>({
            mutationFn: createQRCode,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
            }
        });
    };

    const useUpdateQRCode = () => {
        return useMutation<QRCodesResponse, Error, { id: string; data: Partial<QRCodeRequest> }>({
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
        return useMutation<QRCodesResponse, Error, { id: string; status: string }>({
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

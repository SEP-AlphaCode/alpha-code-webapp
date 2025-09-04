import { createMarker, getAllMarkers, getMarkerById, updateMarker, deleteMarker, updateMarkerStatus } from "@/api/maker-api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MakerRequest, MakerResponse } from "@/types/maker";

export const useMarker = () => {
    const queryClient = useQueryClient();

    const useGetAllMarkers = () => {
        return useQuery<MakerResponse>({
            queryKey: ["markers"],
            queryFn: getAllMarkers
        });
    };

    const useGetMarkerById = (id: string) => {
        return useQuery<MakerResponse>({
            queryKey: ["markers", id],
            queryFn: () => getMarkerById(id)
        });
    };

    const useCreateMarker = () => {
        return useMutation<MakerResponse, Error, MakerRequest>({
            mutationFn: createMarker,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["markers"] });
            }
        });
    };

    const useUpdateMarker = () => {
        return useMutation<MakerResponse, Error, { id: string; data: Partial<MakerRequest> }>({
            mutationFn: ({ id, data }) => updateMarker(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["markers"] });
            }
        });
    };

    const useDeleteMarker = () => {
        return useMutation<void, Error, string>({
            mutationFn: deleteMarker,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["markers"] });
            }
        });
    };

    const useUpdateMarkerStatus = () => {
        return useMutation<MakerResponse, Error, { id: string; status: string }>({
            mutationFn: ({ id, status }) => updateMarkerStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["markers"] });
            }
        });
    };

    return {
        useGetAllMarkers,
        useGetMarkerById,
        useCreateMarker,
        useUpdateMarker,
        useDeleteMarker,
        useUpdateMarkerStatus
    };
};

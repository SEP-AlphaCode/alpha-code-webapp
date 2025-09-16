import { getAllMusics, getPagedMusics, getMusicById, createMusic, updateMusic, deleteMusic, convertAudioToWav } from "@/api/music-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Music, MusicResponse, AudioConvertRequest, AudioConvertResponse } from "@/types/music";
import { PagedResult } from "@/types/page-result";

export const useMusic = () => {
    const queryClient = useQueryClient();

    // Get all musics
    const useGetAllMusics = () => {
        return useQuery<PagedResult<Music>>({
            queryKey: ['musics'],
            staleTime: 0,
            queryFn: getAllMusics,
        });
    };

    // Get paged musics with search
    const useGetPagedMusics = (page: number, size: number, search?: string) => {
        return useQuery<MusicResponse>({
            queryKey: ['musics', 'paged', page, size, search],
            staleTime: 0,
            queryFn: ({ signal }) => getPagedMusics(page, size, search, signal),
            enabled: true,
        });
    };

    // Get music by ID
    const useGetMusicById = (id: string) => {
        return useQuery<Music>({
            queryKey: ['music', id],
            staleTime: 0,
            queryFn: () => getMusicById(id),
            enabled: !!id,
        });
    };

    // Create music mutation
    const useCreateMusic = () => {
        return useMutation({
            mutationFn: createMusic,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['musics'] });
            },
        });
    };

    // Update music mutation (PATCH - partial update)
    const useUpdateMusic = () => {
        return useMutation({
            mutationFn: ({ id, musicData }: { id: string; musicData: Partial<Omit<Music, 'id' | 'createdDate' | 'lastUpdate'>> }) => 
                updateMusic(id, musicData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['musics'] });
            },
        });
    };

    // Delete music mutation
    const useDeleteMusic = () => {
        return useMutation({
            mutationFn: deleteMusic,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['musics'] });
            },
        });
    };

    // Convert audio to WAV mutation
    const useConvertAudio = () => {
        return useMutation<AudioConvertResponse, Error, AudioConvertRequest>({
            mutationFn: convertAudioToWav,
            // Note: We don't invalidate musics cache here as this is just conversion,
            // not creating/updating music records
        });
    };

    return {
        useGetAllMusics,
        useGetPagedMusics,
        useGetMusicById,
        useCreateMusic,
        useUpdateMusic,
        useDeleteMusic,
        useConvertAudio,
    };
};
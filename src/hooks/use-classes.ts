import { getAllClasses, getPagedClasses, getClassById, createClass, updateClass, updateClassStatus, deleteClass } from "@/api/class-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Class, ClassResponse } from "@/types/class";
import { PagedResult } from "@/types/page-result";

export const useClasses = () => {
    const queryClient = useQueryClient();

    // Get all classes
    const useGetAllClasses = () => {
        return useQuery<PagedResult<Class>>({
            queryKey: ['classes'],
            staleTime: 0,
            queryFn: getAllClasses,
        });
    };

    // Get paged classes with status filter
    const useGetPagedClasses = (page: number, size: number, status?: number) => {
        return useQuery<ClassResponse>({
            queryKey: ['classes', 'paged', page, size, status],
            staleTime: 0,
            queryFn: ({ signal }) => getPagedClasses(page, size, status, signal),
            enabled: true,
        });
    };

    // Get class by ID
    const useGetClassById = (id: string) => {
        return useQuery<Class>({
            queryKey: ['class', id],
            staleTime: 0,
            queryFn: () => getClassById(id),
            enabled: !!id,
        });
    };

    // Create class mutation
    const useCreateClass = () => {
        return useMutation({
            mutationFn: createClass,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['classes'] });
            },
        });
    };

    // Update class mutation (PATCH - partial update)
    const useUpdateClass = () => {
        return useMutation({
            mutationFn: ({ id, classData }: { id: string; classData: Partial<Omit<Class, 'id' | 'createdDate' | 'lastUpdate' | 'statusText' | 'teachers'>> }) => 
                updateClass(id, classData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['classes'] });
            },
        });
    };

    // Update class status mutation
    const useUpdateClassStatus = () => {
        return useMutation({
            mutationFn: ({ id, status }: { id: string; status: number }) => 
                updateClassStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['classes'] });
            },
        });
    };

    // Delete class mutation
    const useDeleteClass = () => {
        return useMutation({
            mutationFn: deleteClass,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['classes'] });
            },
        });
    };

    return {
        useGetAllClasses,
        useGetPagedClasses,
        useGetClassById,
        useCreateClass,
        useUpdateClass,
        useUpdateClassStatus,
        useDeleteClass,
    };
};
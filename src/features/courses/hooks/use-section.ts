import { 
    createSection,
    getSectionsByCourseId,
    getSectionById,
    updateSection,
    deleteSection
} from "@/features/courses/api/section-api";
import { Section } from "@/types/section";
import { PagedResult } from "@/types/page-result";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

const STALE_TIME = 24 * 3600 * 1000;

export const useSection = () => {
    const queryClient = useQueryClient();

    // GET /api/v1/sections/get-by-course/{courseId} - Get all sections by course id
    const useGetSectionsByCourseId = (
        courseId: string,
        options?: Omit<UseQueryOptions<PagedResult<Section>>, 'queryKey'>
    ) => {
        return useQuery<PagedResult<Section>>({
            queryKey: ['sections', 'course', courseId],
            queryFn: () => getSectionsByCourseId(courseId),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!courseId,
            ...options,
        });
    };

    // GET /api/v1/sections/{id} - Get section by id
    const useGetSectionById = (
        id: string,
        options?: Omit<UseQueryOptions<Section>, 'queryKey'>
    ) => {
        return useQuery<Section>({
            queryKey: ['sections', id],
            queryFn: () => getSectionById(id),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!id,
            ...options,
        });
    };

    // POST /api/v1/sections - Create a new section
    const useCreateSection = () => {
        return useMutation({
            mutationFn: (sectionData: Partial<Section>) => createSection(sectionData),
            onSuccess: (data) => {
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['sections'] });
                if (data.courseId) {
                    queryClient.invalidateQueries({ queryKey: ['sections', 'course', data.courseId] });
                }
                toast.success("Section created successfully");
            },
            onError: (error) => {
                console.error("Error creating section:", error);
                toast.error("Failed to create section");
            },
        });
    };

    // PUT /api/v1/sections/{sectionId} - Update a section
    const useUpdateSection = () => {
        return useMutation({
            mutationFn: ({ sectionId, sectionData }: { sectionId: string; sectionData: Partial<Section> }) => 
                updateSection(sectionId, sectionData),
            onSuccess: (data) => {
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['sections'] });
                queryClient.invalidateQueries({ queryKey: ['sections', data.id] });
                if (data.courseId) {
                    queryClient.invalidateQueries({ queryKey: ['sections', 'course', data.courseId] });
                }
                toast.success("Section updated successfully");
            },
            onError: (error) => {
                console.error("Error updating section:", error);
                toast.error("Failed to update section");
            },
        });
    };

    // DELETE /api/v1/sections/{sectionId} - Delete a section
    const useDeleteSection = () => {
        return useMutation({
            mutationFn: (sectionId: string) => deleteSection(sectionId),
            onSuccess: (_, sectionId) => {
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['sections'] });
                queryClient.removeQueries({ queryKey: ['sections', sectionId] });
                toast.success("Section deleted successfully");
            },
            onError: (error) => {
                console.error("Error deleting section:", error);
                toast.error("Failed to delete section");
            },
        });
    };

    return {
        useGetSectionsByCourseId,
        useGetSectionById,
        useCreateSection,
        useUpdateSection,
        useDeleteSection,
    };
};

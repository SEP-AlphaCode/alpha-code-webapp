import { 
    getLessons,
    getAllLessonsWithSolution,
    getAllLessonsWithSolutionBySection,
    getLessonsBySection,
    getLessonById,
    getLessonWithSolution,
    createLesson,
    updateLesson,
    patchLesson,
    deleteLesson
} from "@/features/courses/api/lesson-api";
import { Lesson } from "@/types/lesson";
import { PagedResult } from "@/types/page-result";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

const STALE_TIME = 24 * 3600 * 1000

export const useLesson = () => {
    const queryClient = useQueryClient();

    // GET /api/v1/lessons/get-by-course/{courseId} - Get all active lessons by course id with pagination
    const useGetLessons = (
        courseId: string, 
        page: number = 1, 
        size: number = 10
    ) => {
        return useQuery<PagedResult<Lesson>>({
            queryKey: ['lessons', 'by-course', courseId, page, size],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getLessons(courseId, page, size, signal),
            refetchOnWindowFocus: false,
            enabled: !!courseId,
            retry: (failureCount, error: unknown) => {
                if (error && typeof error === 'object') {
                    const errorObj = error as { name?: string; code?: string };
                    if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        })
    }

    // GET all lessons for a course (without pagination) - Helper hook
    const useGetAllLessonsByCourse = (courseId: string) => {
        return useQuery<Lesson[]>({
            queryKey: ['lessons', 'all-by-course', courseId],
            staleTime: STALE_TIME,
            queryFn: async ({ signal }) => {
                // Get first page to know total count
                const firstPage = await getLessons(courseId, 1, 1000, signal); // Large size to get all
                return firstPage.data;
            },
            refetchOnWindowFocus: false,
            enabled: !!courseId,
            retry: (failureCount, error: unknown) => {
                if (error && typeof error === 'object') {
                    const errorObj = error as { name?: string; code?: string };
                    if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        })
    }

    // GET /api/v1/lessons/all-with-solution-by-course/{courseId} - Get all lessons with solutions (Admin only)
    const useGetAllLessonsWithSolution = (courseId: string) => {
        return useQuery<Lesson[]>({
            queryKey: ['lessons', 'with-solution', courseId],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getAllLessonsWithSolution(courseId, signal),
            refetchOnWindowFocus: false,
            enabled: !!courseId,
        })
    }

    // GET /api/v1/lessons/all-with-solution-by-section/{sectionId} - Get all lessons with solutions by section id (Admin only)
    const useGetAllLessonsWithSolutionBySection = (sectionId: string) => {
        return useQuery<Lesson[]>({
            queryKey: ['lessons', 'with-solution-by-section', sectionId],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getAllLessonsWithSolutionBySection(sectionId, signal),
            refetchOnWindowFocus: false,
            enabled: !!sectionId,
        })
    }

    // GET /api/v1/lessons/get-by-section/{sectionId} - Get all active lessons by section id
    const useGetLessonsBySection = (sectionId: string) => {
        return useQuery<PagedResult<Lesson>>({
            queryKey: ['lessons', 'by-section', sectionId],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getLessonsBySection(sectionId, signal),
            refetchOnWindowFocus: false,
            enabled: !!sectionId,
            retry: (failureCount, error: unknown) => {
                if (error && typeof error === 'object') {
                    const errorObj = error as { name?: string; code?: string };
                    if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        })
    }

    // GET /api/v1/lessons/{id} - Get active lesson by id
    const useGetLessonById = (
        id: string,
        options?: Omit<UseQueryOptions<Lesson | undefined>, 'queryKey'>
    ) => {
        return useQuery<Lesson | undefined>({
            queryKey: ['lessons', 'detail', id],
            queryFn: () => getLessonById(id),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!id,
            ...options,
        });
    };

    // GET /api/v1/lessons/with-solution/{id} - Get lesson with solution (Admin only)
    const useGetLessonWithSolution = (
        id: string,
        options?: Omit<UseQueryOptions<Lesson | undefined>, 'queryKey'>
    ) => {
        return useQuery<Lesson | undefined>({
            queryKey: ['lessons', 'with-solution', 'detail', id],
            queryFn: () => getLessonWithSolution(id),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!id,
            ...options,
        });
    };

    // POST /api/v1/lessons - Create new lesson
    const useCreateLesson = () => {
        return useMutation({
            mutationFn: createLesson,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['lessons'] });
                toast.success('Tạo bài học thành công!');
            },
            onError: (error: any) => {
                console.error('Create lesson error:', error);
                toast.error('Có lỗi xảy ra khi tạo bài học');
            }
        });
    };

    // PUT /api/v1/lessons/{id} - Update lesson
    const useUpdateLesson = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) => 
                updateLesson(id, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['lessons'] });
                queryClient.invalidateQueries({ queryKey: ['lessons', 'detail', variables.id] });
                toast.success('Cập nhật bài học thành công!');
            },
            onError: (error: any) => {
                console.error('Update lesson error:', error);
                toast.error('Có lỗi xảy ra khi cập nhật bài học');
            }
        });
    };

    // PATCH /api/v1/lessons/{id} - Patch update lesson
    const usePatchLesson = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) => 
                patchLesson(id, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['lessons'] });
                queryClient.invalidateQueries({ queryKey: ['lessons', 'detail', variables.id] });
                toast.success('Cập nhật bài học thành công!');
            },
            onError: (error: any) => {
                console.error('Patch lesson error:', error);
                toast.error('Có lỗi xảy ra khi cập nhật bài học');
            }
        });
    };

    // DELETE /api/v1/lessons/{id} - Delete lesson
    const useDeleteLesson = () => {
        return useMutation({
            mutationFn: deleteLesson,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['lessons'] });
                toast.success('Xóa bài học thành công!');
            },
            onError: (error: any) => {
                console.error('Delete lesson error:', error);
                toast.error('Có lỗi xảy ra khi xóa bài học');
            }
        });
    };

    return {
        useGetLessons,
        useGetAllLessonsByCourse,
        useGetAllLessonsWithSolution,
        useGetAllLessonsWithSolutionBySection,
        useGetLessonsBySection,
        useGetLessonById,
        useGetLessonWithSolution,
        useCreateLesson,
        useUpdateLesson,
        usePatchLesson,
        useDeleteLesson,
    }
}

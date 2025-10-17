import { 
    getCourseBySlug, 
    getCourses, 
    getNoneDeleteCourses,
    getNoneDeleteCourseById,
    getCourseById,
    createCourse,
    updateCourse,
    patchCourse,
    deleteCourse
} from "@/features/courses/api/course-api";
import { Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

const STALE_TIME = 24 * 3600 * 1000

export const useCourse = () => {
    const queryClient = useQueryClient();

    // GET /api/v1/courses - Get all active courses
    const useGetCourses = (page: number, size: number, search?: string, signal?: AbortSignal) => {
        return useQuery<PagedResult<Course>>({
            queryKey: ['courses', page, size, search],
            staleTime: STALE_TIME,
            queryFn: () => getCourses(page, size, search, signal),
            refetchOnWindowFocus: false,
        })
    }

    // GET /api/v1/courses/get-by-slug/{slug} - Get course by slug
    const useGetCourseBySlug = (
        slug: string,
        options?: Omit<UseQueryOptions<Course | undefined>, 'queryKey'>
    ) => {
        return useQuery<Course | undefined>({
            queryKey: ['courses', 'slug', slug],
            queryFn: () => getCourseBySlug(slug),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!slug,
            ...options,
        });
    };

    // GET /api/v1/courses/none-delete - Get all none delete courses
    const useGetNoneDeleteCourses = (page: number, size: number, search?: string, signal?: AbortSignal) => {
        return useQuery<PagedResult<Course>>({
            queryKey: ['courses', 'none-delete', page, size, search],
            staleTime: STALE_TIME,
            queryFn: () => getNoneDeleteCourses(page, size, search, signal),
            refetchOnWindowFocus: false,
        })
    }

    // GET /api/v1/courses/none-delete/{id} - Get none delete course by id
    const useGetNoneDeleteCourseById = (
        id: string,
        options?: Omit<UseQueryOptions<Course | undefined>, 'queryKey'>
    ) => {
        return useQuery<Course | undefined>({
            queryKey: ['courses', 'none-delete', id],
            queryFn: () => getNoneDeleteCourseById(id),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!id,
            ...options,
        });
    };

    // GET /api/v1/courses/{id} - Get course by id
    const useGetCourseById = (
        id: string,
        options?: Omit<UseQueryOptions<Course | undefined>, 'queryKey'>
    ) => {
        return useQuery<Course | undefined>({
            queryKey: ['courses', id],
            queryFn: () => getCourseById(id),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!id,
            ...options,
        });
    };

    // POST /api/v1/courses - Create new course
    const useCreateCourse = () => {
        return useMutation({
            mutationFn: createCourse,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                toast.success('Tạo khóa học thành công!');
            },
            onError: (error: any) => {
                console.error('Create course error:', error);
                toast.error('Có lỗi xảy ra khi tạo khóa học');
            }
        });
    };

    // PUT /api/v1/courses/{id} - Update course
    const useUpdateCourse = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => 
                updateCourse(id, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
                toast.success('Cập nhật khóa học thành công!');
            },
            onError: (error: any) => {
                console.error('Update course error:', error);
                toast.error('Có lỗi xảy ra khi cập nhật khóa học');
            }
        });
    };

    // PATCH /api/v1/courses/{id} - Patch update course
    const usePatchCourse = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => 
                patchCourse(id, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
                toast.success('Cập nhật khóa học thành công!');
            },
            onError: (error: any) => {
                console.error('Patch course error:', error);
                toast.error('Có lỗi xảy ra khi cập nhật khóa học');
            }
        });
    };

    // DELETE /api/v1/courses/{id} - Delete course
    const useDeleteCourse = () => {
        return useMutation({
            mutationFn: deleteCourse,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                toast.success('Xóa khóa học thành công!');
            },
            onError: (error: any) => {
                console.error('Delete course error:', error);
                toast.error('Có lỗi xảy ra khi xóa khóa học');
            }
        });
    };

    return {
        useGetCourses,
        useGetCourseBySlug,
        useGetNoneDeleteCourses,
        useGetNoneDeleteCourseById,
        useGetCourseById,
        useCreateCourse,
        useUpdateCourse,
        usePatchCourse,
        useDeleteCourse,
    }
}
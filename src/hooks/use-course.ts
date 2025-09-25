import { getCategories, getCourses } from "@/api/course-api";
import { Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STALE_TIME = 24 * 3600 * 1000
export const useCourse = () => {
    const useGetCategories = () => {
        return useQuery<PagedResult<Category>>({
            queryKey: ['categories'],
            staleTime: STALE_TIME,
            queryFn: getCategories
        })
    }
    const useGetCourses = (page: number, size: number, search?: string, signal?: AbortSignal) => {
        return useQuery<PagedResult<Course>>({
            queryKey: ['courses', page, size, search],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getCourses(page, size, search, signal)
        })
    }
    return {
        useGetCategories,
        useGetCourses
    }
}
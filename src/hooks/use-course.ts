import { getCategories, getCategoryBySlug, getCourseBySlug, getCourses } from "@/api/course-api";
import { Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

const STALE_TIME = 24 * 3600 * 1000
export const useCourse = () => {
    const useGetCategories = (page: number, size: number, signal?: AbortSignal) => {
        return useQuery<PagedResult<Category>>({
            queryKey: ['categories'],
            staleTime: STALE_TIME,
            queryFn: () => getCategories(page, size, signal),
            refetchOnWindowFocus: false,
        })
    }
    const useGetCourses = (page: number, size: number, search?: string, signal?: AbortSignal) => {
        return useQuery<PagedResult<Course>>({
            queryKey: ['courses', page, size, search],
            staleTime: STALE_TIME,
            queryFn: () => getCourses(page, size, search, signal),
            refetchOnWindowFocus: false,
        })
    }
    const useGetCourseBySlug = (slug: string) => useQuery<Course | undefined>({
        queryKey: ['courses', slug],
        staleTime: STALE_TIME,
        queryFn: () => getCourseBySlug(slug),
        refetchOnWindowFocus: false,
    })
    const useGetCategoryBySlug = (slug: string) => useQuery<Category | undefined>({
        queryKey: ['category', slug],
        staleTime: STALE_TIME,
        queryFn: () => getCategoryBySlug(slug),
        refetchOnWindowFocus: false,
    })
    return {
        useGetCategories,
        useGetCourses,
        useGetCategoryBySlug,
        useGetCourseBySlug,
    }
}
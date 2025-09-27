import { getCategories, getCategoryBySlug, getCourseBySlug, getCourses, getOwnedCourses } from "@/api/course-api";
import { Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

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
    const useGetCourseBySlug = (slug: string) => useQuery<Course | undefined>({
        queryKey: ['courses', slug],
        staleTime: STALE_TIME,
        queryFn: () => getCourseBySlug(slug)
    })
    const useGetCategoryBySlug = (slug: string) => useQuery<Category | undefined>({
        queryKey: ['category', slug],
        staleTime: STALE_TIME,
        queryFn: () => getCategoryBySlug(slug)
    })
    const useGetOwnedCourses = (username: string, page: number, size: number, signal?: AbortSignal) => useQuery<PagedResult<Course>>({
        queryKey: ['owned-courses', username, page, size],
        staleTime: STALE_TIME,
        queryFn: ({ signal }) => getOwnedCourses(username, page, size, signal) // TODO: replace with getOwnedCourses
    })
    return {
        useGetCategories,
        useGetCourses,
        useGetCategoryBySlug,
        useGetCourseBySlug,
        useGetOwnedCourses
    }
}
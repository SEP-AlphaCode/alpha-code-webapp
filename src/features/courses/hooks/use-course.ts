import { getAccountCourses, getAccountLessons, getCategories, getCategoryBySlug, getCourseBySlug, getCourses, markLessonComplete } from "@/features/courses/api/course-api";
import { AccountCourse, AccountLesson, Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

const STALE_TIME = 24 * 3600 * 1000
export const useCourse = () => {
    const useGetCategories = (size: number) => {
        return useInfiniteQuery({
            queryKey: ["categories", size],
            queryFn: ({ pageParam = 1, signal }) =>
                getCategories(pageParam, size, signal),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                // assuming your API returns something like { has_next, page, total_pages }
                return lastPage.has_next ? lastPage.page + 1 : undefined;
            },
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
        });
    };
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
    const useGetAccountCourses = (accountId: string, page: number, size: number) => {
        return useQuery<PagedResult<AccountCourse>>({
            queryKey: ['account-courses', accountId, page, size],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getAccountCourses(accountId, page, size, signal),
            refetchOnWindowFocus: false,
        })
    }
    const useGetAccountLessons = (accountId: string, courseId: string, page: number, size: number) => {
        return useQuery<PagedResult<AccountLesson>>({
            queryKey: ['account-lessons', accountId, courseId, page, size],
            staleTime: STALE_TIME,
            queryFn: ({ signal }) => getAccountLessons(accountId, courseId, page, size, signal),
            refetchOnWindowFocus: false,
        })
    }
    const useMarkLessonComplete = (accountLessonId: string) => {
        return useQuery<void>({
            queryKey: ['mark-lesson-complete', accountLessonId],
            queryFn: ({ signal }) => markLessonComplete(accountLessonId, signal),
            refetchOnWindowFocus: false,
        })
    }
    return {
        useGetCategories,
        useGetCourses,
        useGetCategoryBySlug,
        useGetCourseBySlug,
        useGetAccountCourses,
        useGetAccountLessons,
        useMarkLessonComplete
    }
}
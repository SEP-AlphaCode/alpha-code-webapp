import { getAccountCourses, getAccountLessons, getCategories, getCategoryBySlug, getCourseBySlug, getCourses, getLessons, markLessonComplete } from "@/features/courses/api/course-api";
import { AccountCourse, AccountLesson, Category, Course, Lesson } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useInfiniteQuery, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
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
    const useGetCourseBySlug = (
        slug: string,
        options?: Omit<UseQueryOptions<Course | undefined>, 'queryKey'>
    ) => {
        return useQuery<Course | undefined>({
            queryKey: ['courses', slug],
            queryFn: () => getCourseBySlug(slug),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!slug, // prevents query from firing if slug is empty
            ...options, // allow override
        });
    };
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
    const useGetLessons = (
        courseId: string,
        options?: Omit<UseQueryOptions<PagedResult<Lesson>>, 'queryKey'>
    ) => {
        return useQuery<PagedResult<Lesson>>({
            queryKey: ['lessons', courseId],
            queryFn: () => getLessons(courseId),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!courseId,            
            ...options,
        });
    };
    return {
        useGetCategories,
        useGetCourses,
        useGetCategoryBySlug,
        useGetCourseBySlug,
        useGetAccountCourses,
        useGetAccountLessons,
        useMarkLessonComplete,
        useGetLessons
    }
}
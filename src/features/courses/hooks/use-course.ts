import { AccountCourse, AccountLesson, Category, Course, Lesson } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useInfiniteQuery, useQuery, UseQueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { getCategories, getCategoryBySlug } from "../api/category-api";
import { getCourseBySlug, getCourses } from "../api/course-api";
import { getAccountCourses } from "../api/account-courses";
import { getLessonsByCourseId } from "../api/lesson-api";
import * as courseApi from '@/features/courses/api/course-api';
import { UUID } from "crypto";

const STALE_TIME = 24 * 3600 * 1000
export const useCourse = () => {
    const useGetCategories = (
        page: number,
        size: number,
        search?: string,
        signal?: AbortSignal
    ) => {
        return useQuery<PagedResult<Category>>({
            queryKey: ['categories', page, size, search],
            staleTime: STALE_TIME, // optional: add if needed
            queryFn: () => getCategories(page, size, search, signal),
            refetchOnWindowFocus: false,
        });
    };

    const useGetCourses = (page: number, size: number, search?: string, signal?: AbortSignal) => {
        return useQuery<PagedResult<Course> | null>({
            queryKey: ['courses', page, size, search],
            staleTime: STALE_TIME,
            queryFn: () => getCourses(page, size, search, signal),
            refetchOnWindowFocus: false,
        })
    }

    const useGetCoursesByCategory = (categoryId: string, page: number = 1, size: number = 10, signal?: AbortSignal) => {
        return useQuery<PagedResult<Course> | null>({
            queryKey: ['courses', 'by-category', categoryId, page, size],
            staleTime: STALE_TIME,
            queryFn: () => courseApi.getCoursesByCategory(categoryId, page, size, signal),
            refetchOnWindowFocus: false,
            enabled: !!categoryId
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
    /* const useGetAccountLessons = (accountId: string, courseId: string, page: number, size: number) => {
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
    } */
    const useGetLessonsByCourseId = (
        courseId: string,
        options?: Omit<UseQueryOptions<PagedResult<Lesson>>, 'queryKey'>
    ) => {
        return useQuery<PagedResult<Lesson>>({
            queryKey: ['lessons', courseId],
            queryFn: () => getLessonsByCourseId(courseId),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            enabled: !!courseId,
            ...options,
        });
    };
    return {
        useGetCategories,
        useGetCourses,
        useGetCoursesByCategory,
        useGetCategoryBySlug,
        useGetCourseBySlug,
        useGetAccountCourses,
        /*  useGetAccountLessons,
         useMarkLessonComplete, */
        useGetLessonsByCourseId
    }
}

// ==================== STAFF COURSE MANAGEMENT HOOKS ====================

export function useStaffCourses(params?: {
  page?: number
  size?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['staff', 'courses', params],
    queryFn: ({ signal }) => courseApi.getNoneDeleteCourses(
      params?.page || 0,
      params?.size || 20,
      params?.search,
      signal
    ),
  })
}

export function useStaffCourse(slug: string) {
  return useQuery({
    queryKey: ['staff', 'course', slug],
    queryFn: ({ signal }) => courseApi.getCourseBySlug(slug, signal),
    enabled: !!slug,
    staleTime: 0, // Always refetch on mount to get fresh data
    retry: (failureCount, error) => {
      // Don't retry if request was canceled
      if (error && 'code' in error && error.code === 'ERR_CANCELED') {
        return false
      }
      // Only retry once for other errors
      return failureCount < 1
    },
    retryDelay: 500, // Wait 500ms before retry
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: FormData) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      router.push('/staff/courses')
    },
  })
}

export function useUpdateCourse(id: string, courseSlug?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      name: string
      description: string
      categoryId: string
      level: number
      price: number
      image?: string | File
      status?: number
      requireLicense: boolean
    }) => courseApi.updateCourse(id, data),
    onSuccess: () => {
      // Invalidate all course-related queries
      queryClient.invalidateQueries({ queryKey: ['staff', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['staff', 'course'] }) // This will match both ID and slug
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      // Redirect to detail page if slug provided, otherwise to list
      if (courseSlug) {
        router.push(`/staff/courses/${courseSlug}`)
      } else {
        router.push('/staff/courses')
      }
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),
    onSuccess: () => {
      // Invalidate all queries that start with ['staff', 'courses']
      queryClient.invalidateQueries({ 
        queryKey: ['staff', 'courses'],
        refetchType: 'active' // Refetch all active queries immediately
      })
      queryClient.invalidateQueries({ 
        queryKey: ['courses'],
        refetchType: 'active'
      })
    },
  })
}

// ==================== DASHBOARD STATS ====================

export function useStaffDashboardStats() {
  return useQuery({
    queryKey: ['staff', 'dashboard', 'stats'],
    queryFn: ({ signal }) => courseApi.getStaffDashboardStats(signal),
  })
}
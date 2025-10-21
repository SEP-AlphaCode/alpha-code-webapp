import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import * as lessonApi from '@/features/courses/api/lesson-api'

// ==================== LESSON HOOKS ====================

export function useLessonsBySection(courseId: string, sectionId: string) {
  return useQuery({
    queryKey: ['lessons', 'section', sectionId],
    queryFn: ({ signal }) => lessonApi.getLessonsBySectionId(courseId, sectionId, signal),
    enabled: !!courseId && !!sectionId,
  })
}

export function useAllLessons(params?: {
  page?: number
  size?: number
  courseId?: string
  sectionId?: string
  type?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['lessons', 'all', params],
    queryFn: ({ signal }) => lessonApi.getAllLessons(params, signal),
  })
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: ({ signal }) => lessonApi.getLessonById(lessonId, signal),
    enabled: !!lessonId,
  })
}

export function useLessonBySlug(slug: string) {
  return useQuery({
    queryKey: ['lesson', 'slug', slug],
    queryFn: ({ signal }) => lessonApi.getLessonBySlug(slug, signal),
    enabled: !!slug,
  })
}

export function useCreateLesson(courseId: string, sectionId: string, courseSlug?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      title: string
      content: string
      videoFile?: File
      duration: number
      requireRobot: boolean
      type: number
      solution?: object
    }) => lessonApi.createLesson(sectionId, data),
    onSuccess: () => {
      // Invalidate all lessons queries for this course
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lessons', 'section', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['sections', courseId] })
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      // Invalidate all course queries (both by ID and slug)
      queryClient.invalidateQueries({ queryKey: ['staff', 'course'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      
      if (courseSlug) {
        router.push(`/staff/courses/${courseSlug}`)
      } else {
        router.push(`/staff/courses/${courseId}`)
      }
    },
  })
}

export function useUpdateLesson(courseId: string, lessonId: string, sectionId?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      title: string
      content: string
      videoUrl?: string
      duration: number
      requireRobot: boolean
      type: number
      orderNumber: number
      sectionId?: string
      solution?: unknown
    }) => lessonApi.updateLesson(lessonId, data),
    onSuccess: () => {
      // Invalidate all lessons queries for this course
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] })
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: ['lessons', 'section', sectionId] })
      }
      queryClient.invalidateQueries({ queryKey: ['sections', courseId] })
      // Invalidate all course queries (both by ID and slug)
      queryClient.invalidateQueries({ queryKey: ['staff', 'course'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      router.push(`/staff/courses/${courseId}`)
    },
  })
}

export function useDeleteLesson(courseId: string, sectionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => lessonApi.deleteLesson(lessonId),
    onSuccess: () => {
      // Invalidate all lessons queries for this course
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] })
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: ['lessons', 'section', sectionId] })
      }
      queryClient.invalidateQueries({ queryKey: ['sections', courseId] })
      // Invalidate all course queries (both by ID and slug)
      queryClient.invalidateQueries({ queryKey: ['staff', 'course'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  })
}

export function useUpdateLessonOrder(courseId: string, sectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessons: Array<{ id: string; orderNumber: number; sectionId: string }>) =>
      lessonApi.updateLessonOrder(sectionId, lessons),
    onSuccess: () => {
      // Invalidate all lessons queries for this course
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lessons', 'section', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['sections', courseId] })
      // Invalidate all course queries (both by ID and slug)
      queryClient.invalidateQueries({ queryKey: ['staff', 'course'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AccountLesson } from '@/types/account-lessons'
import * as accountLessonsApi from '@/features/courses/api/account-lessons-api'

const STALE_TIME = 24 * 3600 * 1000

export const useGetAccountLessons = (courseId?: string, accountId?: string) => {
  return useQuery<AccountLesson[] | null>({
    queryKey: ['account-lessons', courseId, accountId],
    queryFn: ({ signal }) => accountLessonsApi.getAccountLessons(courseId, accountId, signal),
    enabled: !!courseId && !!accountId,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useGetAccountLessonById = (id?: string) => {
  return useQuery<AccountLesson | undefined>({
    queryKey: ['account-lesson', id],
    queryFn: ({ signal }) => accountLessonsApi.getAccountLessonById(id || '', signal),
    enabled: !!id,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  })
}

export function useCreateAccountLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<AccountLesson>) => accountLessonsApi.createAccountLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-lessons'] })
      queryClient.invalidateQueries({ queryKey: ['account-lesson'] })
    },
  })
}

export function useMarkAccountLessonComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (accountLessonId: string) => accountLessonsApi.markAccountLessonComplete(accountLessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-lessons'] })
      queryClient.invalidateQueries({ queryKey: ['account-lesson'] })
    },
  })
}

const accountLessonsHooks = {
  useGetAccountLessons,
  useGetAccountLessonById,
  useCreateAccountLesson,
  useMarkAccountLessonComplete,
}

export default accountLessonsHooks

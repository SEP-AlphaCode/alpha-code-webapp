import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PagedResult } from '@/types/page-result'
import { AccountCourse } from '@/types/account-course'
import * as accountCourseApi from '@/features/courses/api/account-course-api'

const STALE_TIME = 24 * 3600 * 1000

export const useGetAccountCoursesByAccount = (accountId: string, page = 1, size = 10, search?: string) => {
	return useQuery<PagedResult<AccountCourse> | null>({
		queryKey: ['account-courses', accountId, page, size, search],
		queryFn: ({ signal }) => accountCourseApi.getAccountCoursesByAccount(accountId, page, size, search, signal),
		enabled: !!accountId,
		staleTime: STALE_TIME,
		refetchOnWindowFocus: false,
	})
}

export const useGetAccountCourseById = (id?: string) => {
	return useQuery<AccountCourse | undefined>({
		queryKey: ['account-course', id],
		queryFn: ({ signal }) => accountCourseApi.getAccountCourseById(id || '', signal),
		enabled: !!id,
		staleTime: STALE_TIME,
		refetchOnWindowFocus: false,
	})
}



export function useCreateAccountCourse() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: Partial<AccountCourse>) => accountCourseApi.createAccountCourse(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['account-courses'] })
			queryClient.invalidateQueries({ queryKey: ['account-course'] })
		},
	})
}

export function useCreateAccountCoursesFromBundle() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: unknown) => accountCourseApi.createAccountCoursesFromBundle(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['account-courses'] })
			queryClient.invalidateQueries({ queryKey: ['account-course'] })
		},
	})
}

export function useDeleteAccountCourse() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => accountCourseApi.deleteAccountCourse(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['account-courses'] })
			queryClient.invalidateQueries({ queryKey: ['account-course'] })
		},
	})
}

const accountCourseHooks = {
 	useGetAccountCoursesByAccount,
 	useGetAccountCourseById,
 	useCreateAccountCourse,
 	useCreateAccountCoursesFromBundle,
 	useDeleteAccountCourse,
}

export default accountCourseHooks


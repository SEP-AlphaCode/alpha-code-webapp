import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Account } from "@/types/account"
import { PagedResult } from "@/types/page-result"
import { teacherApi } from "./teacher-api"

export const useTeacher = () => {
  const queryClient = useQueryClient()

  const useGetAllTeachers = (page = 1, perPage = 10) => {
    return useQuery<PagedResult<Account>>({
      queryKey: ["teachers", page, perPage],
      queryFn: () => teacherApi.getAllTeachers(page, perPage),
    })
  }

  const useGetTeacherById = (id: string) => {
    return useQuery<Account | null>({
      queryKey: ["teacher", id],
      queryFn: () => teacherApi.getTeacherById(id),
      enabled: !!id,
    })
  }

  const useCreateTeacher = () => {
    return useMutation({
      mutationFn: (teacherData: Partial<Account>) => teacherApi.createTeacher(teacherData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] })
      },
    })
  }

  const useUpdateTeacher = () => {
    return useMutation({
      mutationFn: ({ id, teacherData }: { id: string; teacherData: Partial<Account> }) =>
        teacherApi.updateTeacher(id, teacherData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] })
      },
    })
  }

  const useDeleteTeacher = () => {
    return useMutation({
      mutationFn: (id: string) => teacherApi.deleteTeacher(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] })
      },
    })
  }

  return {
    useGetAllTeachers,
    useGetTeacherById,
    useCreateTeacher,
    useUpdateTeacher,
    useDeleteTeacher,
  }
}

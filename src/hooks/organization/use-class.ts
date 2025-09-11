import { Classroom } from "@/types/class-entity"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllClassrooms, getClassroomById, createClassroom, updateClassroom, deleteClassroom } from "./class"


export const useClassroom = () => {
  const queryClient = useQueryClient()

  const useGetAllClassrooms = (page: number, perPage: number) => {
    return useQuery({
      queryKey: ["classrooms", page, perPage],
      queryFn: () => getAllClassrooms(page, perPage),
    })
  }

  const useGetClassroomById = (id: string) => {
    return useQuery({
      queryKey: ["classroom", id],
      queryFn: () => getClassroomById(id),
      enabled: !!id,
    })
  }

  const useCreateClassroom = () => {
    return useMutation({
      mutationFn: createClassroom,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      },
    })
  }

  const useUpdateClassroom = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Classroom, "id" | "createdAt">> }) =>
        updateClassroom(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      },
    })
  }

  const useDeleteClassroom = () => {
    return useMutation({
      mutationFn: deleteClassroom,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      },
    })
  }

  return {
    useGetAllClassrooms,
    useGetClassroomById,
    useCreateClassroom,
    useUpdateClassroom,
    useDeleteClassroom,
  }
}

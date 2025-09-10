import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { PagedResult } from "@/types/page-result"
import { ClassDto } from "@/types/class-entity"
import { createClass, deleteClass, getAllClasses, getClassById, updateClass } from "./class"

export const useClass = () => {
  const queryClient = useQueryClient()

  // Get all classes with pagination
  const useGetAllClasses = (page = 1, perPage = 10) => {
    return useQuery<PagedResult<ClassDto>>({
      queryKey: ["classes", page, perPage],
      staleTime: 0,
      queryFn: () => getAllClasses(page, perPage),
    })
  }

  // Get class by ID
  const useGetClassById = (id: string) => {
    return useQuery<ClassDto>({
      queryKey: ["class", id],
      staleTime: 0,
      queryFn: () => getClassById(id),
      enabled: !!id,
    })
  }

  // Create class mutation
  const useCreateClass = () => {
    return useMutation({
      mutationFn: createClass,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] })
      },
    })
  }

  // Update class mutation
  const useUpdateClass = () => {
    return useMutation({
      mutationFn: ({ id, classData }: { id: string; classData: Partial<Omit<ClassDto, "id" | "createdDate">> }) =>
        updateClass(id, classData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] })
      },
    })
  }

  // Delete class mutation
  const useDeleteClass = () => {
    return useMutation({
      mutationFn: deleteClass,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] })
      },
    })
  }

  return {
    useGetAllClasses,
    useGetClassById,
    useCreateClass,
    useUpdateClass,
    useDeleteClass,
  }
}

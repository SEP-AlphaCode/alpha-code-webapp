import {
  getAllSkills,
  createSkill,
  getSkillByCode,
  getSkillByName,
  getSkillsByRobotModel,
  getSkillById,
  patchSkill,
  updateSkill,
  deleteSkill,
  changeSkillStatus
} from "@/features/activities/api/skill-api"
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Skill, SkillResponse } from "@/types/skill"

export const useSkill = () => {
  // 🔹 Lấy danh sách robot models
  const useGetRobotModels = () => {
    return useQuery({
      queryKey: ["robotModels"],
      queryFn: getAllRobotModels,
      staleTime: 1000 * 60 * 10, // 10 phút
    })
  }

  // 🔹 Lấy tất cả skills (phân trang + lọc)
  const useGetAllSkills = (page?: number, size?: number, search?: string, robotModelId?: string) => {
    return useQuery<SkillResponse>({
      queryKey: ["skills", page, size, search, robotModelId],
      queryFn: () =>
        getAllSkills({
            page,
            size,
            search,
            robotModelId,
        }),
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo trang và gộp robot models
  const useGetPagedSkills = (page: number, size: number, search?: string) => {
    const skillsQuery = useQuery<SkillResponse>({
      queryKey: ["skills", "paged", page, size, search],
      queryFn: () =>
        getAllSkills({
            page,
            size,
            search,
        }),
      staleTime: 0,
      enabled: true,
    })

    const robotModelsQuery = useGetRobotModels()

    // ✅ Trả về kết hợp cả hai
    return {
      data: skillsQuery.data
        ? {
            ...skillsQuery.data,
            robotModels: robotModelsQuery.data?.data || [],
            skills: skillsQuery.data.data || [],
          }
        : undefined,
      isLoading: skillsQuery.isLoading || robotModelsQuery.isLoading,
      error: skillsQuery.error || robotModelsQuery.error,
      refetch: () => {
        skillsQuery.refetch()
        robotModelsQuery.refetch()
      },
    }
  }

  // 🔹 Lấy skill theo code
  const useGetSkillByCode = (code: string) => {
    return useQuery<Skill>({
      queryKey: ["skills", "code", code],
      queryFn: () => getSkillByCode(code),
      enabled: !!code,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo name
  const useGetSkillByName = (name: string) => {
    return useQuery<Skill>({
      queryKey: ["skills", "name", name],
      queryFn: () => getSkillByName(name),
      enabled: !!name,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo robot model
  const useGetSkillsByRobotModel = (robotModelId: string, page?: number, size?: number) => {
    return useQuery<SkillResponse>({
      queryKey: ["skills", "robot-model", robotModelId, page, size],
      queryFn: () => getSkillsByRobotModel(robotModelId, page, size),
      enabled: !!robotModelId,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo ID
  const useGetSkillById = (id: string) => {
    return useQuery<Skill>({
      queryKey: ["skills", id],
      queryFn: () => getSkillById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    })
  }

  const useCreateSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: createSkill,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
      },
    })
  }

  const useUpdateSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, skillData }: { id: string; skillData: Omit<Skill, "id" | "createdDate" | "lastUpdate"> }) =>
        updateSkill(id, skillData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
        queryClient.invalidateQueries({ queryKey: ["skills", variables.id] })
      },
    })
  }

  const usePatchSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, skillData }: { id: string; skillData: Partial<Omit<Skill, "id" | "createdDate" | "lastUpdate">> }) =>
        patchSkill(id, skillData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
        queryClient.invalidateQueries({ queryKey: ["skills", variables.id] })
      },
    })
  }

  const useDeleteSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: deleteSkill,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
      },
    })
  }

  const useChangeSkillStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: number }) => changeSkillStatus(id, status),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
        queryClient.invalidateQueries({ queryKey: ["skills", variables.id] })
      },
    })
  }

  return {
    // Queries
    useGetAllSkills,
    useGetPagedSkills,
    useGetSkillByCode,
    useGetSkillByName,
    useGetSkillsByRobotModel,
    useGetSkillById,
    useGetRobotModels,

    // Mutations
    useCreateSkill,
    useUpdateSkill,
    usePatchSkill,
    useDeleteSkill,
    useChangeSkillStatus,
  }
}

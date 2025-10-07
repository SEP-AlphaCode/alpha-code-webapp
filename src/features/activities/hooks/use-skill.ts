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
} from "@/features/activities/api/skill-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skill, SkillResponse } from "@/types/skill";

export const useSkill = () => {
    const queryClient = useQueryClient();

    // Get all skills with pagination and filters
    const useGetAllSkills = (page?: number, size?: number, search?: string, robotModelId?: string) => {
        return useQuery<SkillResponse>({
            queryKey: ['skills', page, size, search, robotModelId],
            queryFn: ({ signal }) => getAllSkills(page, size, search, robotModelId, signal),
            staleTime: 1000 * 60 * 5, // 5 minutes
        });
    };

    // Get paged skills (alias for consistency)
    const useGetPagedSkills = (page: number, size: number, search?: string) => {
        return useQuery<SkillResponse>({
            queryKey: ['skills', 'paged', page, size, search],
            queryFn: ({ signal }) => getAllSkills(page, size, search, undefined, signal),
            staleTime: 0,
            enabled: true,
        });
    };

    // Get skill by code
    const useGetSkillByCode = (code: string) => {
        return useQuery<Skill>({
            queryKey: ['skills', 'code', code],
            queryFn: () => getSkillByCode(code),
            enabled: !!code,
            staleTime: 1000 * 60 * 5,
        });
    };

    // Get skill by name
    const useGetSkillByName = (name: string) => {
        return useQuery<Skill>({
            queryKey: ['skills', 'name', name],
            queryFn: () => getSkillByName(name),
            enabled: !!name,
            staleTime: 1000 * 60 * 5,
        });
    };

    // Get skills by robot model
    const useGetSkillsByRobotModel = (robotModelId: string, page?: number, size?: number) => {
        return useQuery<SkillResponse>({
            queryKey: ['skills', 'robot-model', robotModelId, page, size],
            queryFn: ({ signal }) => getSkillsByRobotModel(robotModelId, page, size, signal),
            enabled: !!robotModelId,
            staleTime: 1000 * 60 * 5,
        });
    };

    // Get skill by ID
    const useGetSkillById = (id: string) => {
        return useQuery<Skill>({
            queryKey: ['skills', id],
            queryFn: () => getSkillById(id),
            enabled: !!id,
            staleTime: 1000 * 60 * 5,
        });
    };

    // Create skill mutation
    const useCreateSkill = () => {
        return useMutation({
            mutationFn: createSkill,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
            },
        });
    };

    // Update skill mutation (PUT)
    const useUpdateSkill = () => {
        return useMutation({
            mutationFn: ({ id, skillData }: { 
                id: string; 
                skillData: Omit<Skill, 'id' | 'createdDate' | 'lastUpdate'>
            }) => updateSkill(id, skillData),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
                queryClient.invalidateQueries({ queryKey: ['skills', variables.id] });
            },
        });
    };

    // Patch skill mutation (PATCH)
    const usePatchSkill = () => {
        return useMutation({
            mutationFn: ({ id, skillData }: { 
                id: string; 
                skillData: Partial<Omit<Skill, 'id' | 'createdDate' | 'lastUpdate'>>
            }) => patchSkill(id, skillData),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
                queryClient.invalidateQueries({ queryKey: ['skills', variables.id] });
            },
        });
    };

    // Delete skill mutation
    const useDeleteSkill = () => {
        return useMutation({
            mutationFn: deleteSkill,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
            },
        });
    };

    // Change skill status mutation
    const useChangeSkillStatus = () => {
        return useMutation({
            mutationFn: ({ id, status }: { id: string; status: number }) => 
                changeSkillStatus(id, status),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
                queryClient.invalidateQueries({ queryKey: ['skills', variables.id] });
            },
        });
    };

    return {
        // Queries
        useGetAllSkills,
        useGetPagedSkills,
        useGetSkillByCode,
        useGetSkillByName,
        useGetSkillsByRobotModel,
        useGetSkillById,
        
        // Mutations
        useCreateSkill,
        useUpdateSkill,
        usePatchSkill,
        useDeleteSkill,
        useChangeSkillStatus,
    };
};

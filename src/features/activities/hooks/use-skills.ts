import { createSkill, getPagedSkills, updateSkill, deleteSkill } from "@/features/activities/api/skill-api";
import { SkillModal } from "@/types/skills";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSkill = () => {
    const queryClient = useQueryClient();


    const useGetPagedSkills = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['skills', page, limit, search],
            queryFn: () => getPagedSkills(page, limit, search)
        });
    }

    // Create skill mutation
    const useCreateSkill = () => {
        return useMutation({
            mutationFn: createSkill,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
            },
        });
    };

    // Update skill mutation
    const useUpdateSkill = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: SkillModal }) => updateSkill(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['skills'] });
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

    return {
        useGetPagedSkills,
        useCreateSkill,
        useUpdateSkill,
        useDeleteSkill
    }
};

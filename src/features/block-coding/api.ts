import { Action } from "@/types/action";
import { Dance } from "@/types/dance";
import { Expression } from "@/types/expression";
import { ExtendedActionResponse } from "@/types/extended-action";
import { PagedResult } from "@/types/page-result";
import { SkillResponse } from "@/types/skill";
import { activitiesHttp } from "@/utils/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getSelectOptions = (robotModelId: string) => {
    const params = {
        page: 1,
        size: 1000,
        robotModelId
    }

    const getActions = async (
        signal?: AbortSignal,
    ) => {
        try {
            const response = await activitiesHttp.get<PagedResult<Action>>("/actions", {
                params,
                signal,
            });

            return response.data;
        } catch (error) {
            console.error("API Error in getPagedActions:", error);
            throw error;
        }
    };

    const getDances = async (
        signal?: AbortSignal,
    ) => {
        try {
            const response = await activitiesHttp.get<PagedResult<Dance>>("/dances", {
                params,
                signal,
            });

            return response.data;
        } catch (error) {
            console.error("API Error in getPagedDances:", error);
            throw error;
        }
    };

    const getExpressions = async (
        signal?: AbortSignal
    ) => {
        try {
            const response = await activitiesHttp.get<PagedResult<Expression>>("/expressions", {
                params,
                signal,
            });

            return response.data;
        } catch (error) {
            console.error("API Error in getPagedExpressions:", error);
            throw error;
        }
    };

    const getExtendedActions = async (
        signal?: AbortSignal
    ) => {
        try {
            const response = await activitiesHttp.get<ExtendedActionResponse>("/extended-actions", {
                params,
                signal,
            });
            return response.data;
        } catch (error) {
            console.error("API Error in getPagedExtendedActions:", error);
            throw error;
        }
    };

    const getSkills = async (signal?: AbortSignal): Promise<SkillResponse> => {
        const response = await activitiesHttp.get<SkillResponse>("/skills", { params, signal })
        return response.data
    }
    return {
        getActions, getExpressions, getExtendedActions, getSkills, params
    }
}

export const useGetSelectOptions = (robotModelId: string) => {
    const queryClient = useQueryClient();
    const { getActions, getExpressions, getExtendedActions, getSkills, params } = getSelectOptions(robotModelId)
    const { page, size } = params
    const useGetActions = () => {
        return useQuery({
            queryKey: ['actions', page, size, robotModelId],
            queryFn: () => getActions()
        });
    }
    const useGetExpressions = () => {
        return useQuery({
            queryKey: ['expressions', page, size, robotModelId],
            queryFn: () => getExpressions()
        });
    }
    const useGetExtendedActions = () => {
        return useQuery({
            queryKey: ['extended-actions', page, size, robotModelId],
            queryFn: () => getExtendedActions()
        });
    }
    const useGetSkills = () => {
        return useQuery({
            queryKey: ['skills', page, size, robotModelId],
            queryFn: () => getSkills()
        });
    }
    return {
        useGetActions,
        useGetExpressions,
        useGetExtendedActions,
        useGetSkills
    }
}
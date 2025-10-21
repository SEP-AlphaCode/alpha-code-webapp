import { Action } from "@/types/action";
import { Dance } from "@/types/dance";
import { Expression } from "@/types/expression";
import { ExtendedActionResponse } from "@/types/extended-action";
import { PagedResult } from "@/types/page-result";
import { activitiesHttp } from "@/utils/http";

export const getSelectOptions = (robotModelId: string) => {
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
    return {
        getActions, getDances, getExpressions, getExtendedActions
    }
}
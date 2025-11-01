import { useQuery } from "@tanstack/react-query";
import { getSelectOptions } from "./api";
import { pythonHttp } from "@/utils/http";

export const useGetSelectOptions = (robotModelId: string) => {
    const { getActions, getExpressions, getExtendedActions, getSkills, params, getCodingBlockStatus } = getSelectOptions(robotModelId)
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

    const useGetCodingBlockStatus = (shouldDo: boolean, serial: string, interval: number) => {
        return useQuery({
            queryKey: ['coding-block-status', serial],
            queryFn: () => getCodingBlockStatus(serial),
            enabled: shouldDo,
            refetchInterval: interval,
            staleTime: interval,
            retry: false,
        })
    }

    return {
        useGetActions,
        useGetExpressions,
        useGetExtendedActions,
        useGetSkills,
        useGetCodingBlockStatus
    }
}
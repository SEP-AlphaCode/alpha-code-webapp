import { 
  getAllExtendedActions, 
  getPagedExtendedActions,
  getExtendedActionById, 
  getExtendedActionByCode,
  getExtendedActionByName,
  getExtendedActionsByRobotModel,
  createExtendedAction, 
  updateExtendedAction,
  patchExtendedAction, 
  deleteExtendedAction, 
  changeExtendedActionStatus 
} from "@/features/activities/api/extended-action-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RobotCommand, RobotCommandResponse } from "@/types/extended-action";

export const useExtendedActions = () => {
    const queryClient = useQueryClient();

    const useGetAllExtendedActions = () => {
        return useQuery<RobotCommandResponse>({
            queryKey: ["extended-actions"],
            queryFn: getAllExtendedActions
        });
    };

    const useGetPagedExtendedActions = (page: number, size: number, search?: string) => {
        return useQuery<RobotCommandResponse>({
            queryKey: ['extended-actions', 'paged', page, size, search],
            queryFn: ({ signal }) => getPagedExtendedActions(page, size, search, signal),
            staleTime: 0,
            enabled: true,
        });
    };

    const useGetExtendedActionById = (id: string) => {
        return useQuery<RobotCommand>({
            queryKey: ["extended-actions", id],
            queryFn: () => getExtendedActionById(id),
            enabled: !!id,
        });
    };

    const useGetExtendedActionByCode = (code: string) => {
        return useQuery<RobotCommand>({
            queryKey: ["extended-actions", "code", code],
            queryFn: () => getExtendedActionByCode(code),
            enabled: !!code,
        });
    };

    const useGetExtendedActionByName = (name: string) => {
        return useQuery<RobotCommand>({
            queryKey: ["extended-actions", "name", name],
            queryFn: () => getExtendedActionByName(name),
            enabled: !!name,
        });
    };

    const useGetExtendedActionsByRobotModel = (robotModelId: string) => {
        return useQuery<RobotCommandResponse>({
            queryKey: ["extended-actions", "robot-model", robotModelId],
            queryFn: () => getExtendedActionsByRobotModel(robotModelId),
            enabled: !!robotModelId,
        });
    };

    const useCreateExtendedAction = () => {
        return useMutation({
            mutationFn: createExtendedAction,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["extended-actions"] });
            },
        });
    };

    const useUpdateExtendedAction = () => {
        return useMutation({
            mutationFn: ({ id, actionData }: { 
                id: string; 
                actionData: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>> 
            }) => updateExtendedAction(id, actionData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["extended-actions"] });
            },
        });
    };

    const usePatchExtendedAction = () => {
        return useMutation({
            mutationFn: ({ id, actionData }: { 
                id: string; 
                actionData: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>> 
            }) => patchExtendedAction(id, actionData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["extended-actions"] });
            },
        });
    };

    const useDeleteExtendedAction = () => {
        return useMutation({
            mutationFn: deleteExtendedAction,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["extended-actions"] });
            },
        });
    };

    const useChangeExtendedActionStatus = () => {
        return useMutation({
            mutationFn: ({ id, status }: { id: string; status: number }) => 
                changeExtendedActionStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["extended-actions"] });
            },
        });
    };

    return {
        useGetAllExtendedActions,
        useGetPagedExtendedActions,
        useGetExtendedActionById,
        useGetExtendedActionByCode,
        useGetExtendedActionByName,
        useGetExtendedActionsByRobotModel,
        useCreateExtendedAction,
        useUpdateExtendedAction,
        usePatchExtendedAction,
        useDeleteExtendedAction,
        useChangeExtendedActionStatus,
    };
};
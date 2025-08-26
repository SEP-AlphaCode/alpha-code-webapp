import { createAction, getPagedActions } from "@/api/action-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAction = () => {
    const queryClient = useQueryClient();


    const useGetPagedActions = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['actions', page, limit, search],
            queryFn: () => getPagedActions(page, limit, search)
        });
    }

    // Create action mutation
    const useCreateAction = () => {
        return useMutation({
            mutationFn: createAction,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['actions'] });
            },
        });
    };

    return {
        useGetPagedActions,
        useCreateAction
    }
};

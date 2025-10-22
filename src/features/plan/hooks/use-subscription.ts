import { createSubscription, getPagedSubscriptions, deleteSubscription, updateSubscription } from "../api/subscription-api";
import { SubscriptionPlanModal } from "@/types/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubscription = () => {
    const queryClient = useQueryClient();


    const useGetPagedSubscriptions = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['subscription-plans', page, limit, search],
            queryFn: () => getPagedSubscriptions(page, limit, search)
        });
    }


    const useCreateSubscription = () => {
        return useMutation({
            mutationFn: createSubscription,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            },
        });
    };

    const useUpdateSubscription = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: SubscriptionPlanModal }) => updateSubscription(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            },
        });
    };

    const useDeleteSubscription = () => {
        return useMutation({
            mutationFn: deleteSubscription,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            },
        });
    };

    return {
        useGetPagedSubscriptions,
        useCreateSubscription,
        useUpdateSubscription,
        useDeleteSubscription
    }
};

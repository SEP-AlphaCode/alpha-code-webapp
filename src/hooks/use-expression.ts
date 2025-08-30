import { createExpression, getPagedExpressions, updateExpression, deleteExpression } from "@/api/expression-api";
import { ExpressionModal } from "@/types/expression";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useExpression = () => {
    const queryClient = useQueryClient();

    const useGetPagedExpressions = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['expressions', page, limit, search],
            queryFn: () => getPagedExpressions(page, limit, search)
        });
    }

    // Create expression mutation
    const useCreateExpression = () => {
        return useMutation({
            mutationFn: createExpression,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['expressions'] });
            },
        });
    };

    // Update expression mutation
    const useUpdateExpression = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: ExpressionModal }) => updateExpression(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['expressions'] });
            },
        });
    };

    // Delete expression mutation
    const useDeleteExpression = () => {
        return useMutation({
            mutationFn: deleteExpression,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['expressions'] });
            },
        });
    };

    return {
        useGetPagedExpressions,
        useCreateExpression,
        useUpdateExpression,
        useDeleteExpression
    }
};

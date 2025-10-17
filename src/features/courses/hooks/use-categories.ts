import { 
    getCategories, 
    getCategoryById, 
    getCategoryBySlug, 
    getNoneDeleteCategories,
    createCategory, 
    updateCategory, 
    patchCategory, 
    deleteCategory 
} from "@/features/courses/api/categories-api";
import { Category } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from 'sonner';

const STALE_TIME = 24 * 3600 * 1000; // 24 hours

export const useCategories = () => {
    const queryClient = useQueryClient();

    // Simple hook to get all categories (for dropdown, filters, etc.)
    const useGetAllCategories = () => {
        return useQuery<PagedResult<Category>>({
            queryKey: ['categories', 'all'],
            queryFn: ({ signal }) => getCategories(1, 100, undefined, signal), // Get first 100 categories
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
                // Don't retry on canceled errors
                if (error && typeof error === 'object') {
                    const errorObj = error as { name?: string; code?: string };
                    if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        });
    };

    // Get categories with pagination
    const useGetCategories = (page: number = 1, size: number = 10, search?: string) => {
        return useQuery<PagedResult<Category>>({
            queryKey: ['categories', page, size, search || ''],
            queryFn: ({ signal }) => getCategories(page, size, search, signal),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
                // Don't retry on canceled errors
                if (error && typeof error === 'object') {
                    const errorObj = error as { name?: string; code?: string };
                    if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        });
    };

    // Get categories with infinite scroll
    const useGetCategoriesInfinite = (size: number) => {
        return useInfiniteQuery({
            queryKey: ["categories", "infinite", size],
            queryFn: ({ pageParam = 1, signal }) =>
                getCategories(pageParam, size, undefined, signal),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                return lastPage.has_next ? lastPage.page + 1 : undefined;
            },
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
        });
    };

    // Get none-deleted categories
    const useGetNoneDeleteCategories = (page: number = 1, size: number = 10, search?: string) => {
        return useQuery<PagedResult<Category>>({
            queryKey: ['categories', 'none-delete', page, size, search || ''],
            queryFn: ({ signal }) => getNoneDeleteCategories(page, size, search, signal),
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
        });
    };

    // Get category by ID
    const useGetCategoryById = (id: string) => {
        return useQuery<Category>({
            queryKey: ['categories', id],
            queryFn: ({ signal }) => getCategoryById(id, signal),
            enabled: !!id,
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
        });
    };

    // Get category by slug
    const useGetCategoryBySlug = (slug: string) => {
        return useQuery<Category>({
            queryKey: ['categories', 'slug', slug],
            queryFn: ({ signal }) => getCategoryBySlug(slug, signal),
            enabled: !!slug,
            staleTime: STALE_TIME,
            refetchOnWindowFocus: false,
        });
    };

    // Create category mutation
    const useCreateCategory = (options?: { showToast?: boolean }) => {
        const showToast = options?.showToast ?? true;
        
        return useMutation({
            mutationFn: createCategory,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                if (showToast) {
                    toast.success('Category created successfully!');
                }
            },
            onError: (error: unknown) => {
                if (showToast) {
                    const errorMessage = error && typeof error === 'object' && 'message' in error 
                        ? (error as { message: string }).message 
                        : 'Failed to create category';
                    toast.error(errorMessage);
                }
            },
        });
    };

    // Update category mutation
    const useUpdateCategory = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
                updateCategory(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                toast.success('Category updated successfully!');
            },
            onError: (error: unknown) => {
                const errorMessage = error && typeof error === 'object' && 'message' in error 
                    ? (error as { message: string }).message 
                    : 'Failed to update category';
                toast.error(errorMessage);
            },
        });
    };

    // Patch category mutation
    const usePatchCategory = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
                patchCategory(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                toast.success('Category updated successfully!');
            },
            onError: (error: unknown) => {
                const errorMessage = error && typeof error === 'object' && 'message' in error 
                    ? (error as { message: string }).message 
                    : 'Failed to update category';
                toast.error(errorMessage);
            },
        });
    };

    // Delete category mutation
    const useDeleteCategory = () => {
        return useMutation({
            mutationFn: deleteCategory,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                toast.success('Category deleted successfully!');
            },
            onError: (error: unknown) => {
                const errorMessage = error && typeof error === 'object' && 'message' in error 
                    ? (error as { message: string }).message 
                    : 'Failed to delete category';
                toast.error(errorMessage);
            },
        });
    };

    return {
        // Query hooks
        useGetAllCategories,
        useGetCategories,
        useGetCategoriesInfinite,
        useGetNoneDeleteCategories,
        useGetCategoryById,
        useGetCategoryBySlug,
        
        // Mutation hooks
        useCreateCategory,
        useUpdateCategory,
        usePatchCategory,
        useDeleteCategory,
    };
};

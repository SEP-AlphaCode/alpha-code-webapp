import { Category } from "@/types/categories";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// Get all categories with pagination and search
export const getCategories = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Category>>('/categories', {
            params: {
                page,
                size,
                search
            },
            signal // Add AbortSignal support
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object') {
            const errorObj = error as { name?: string; code?: string };
            if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                console.log('API Call canceled for getCategories');
                return Promise.reject(error);
            }
        }
        console.error("API Error in getCategories:", error);
        throw error;
    }
};

// Get category by ID
export const getCategoryById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Category>(`/categories/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategoryById:", error);
        throw error;
    }
};

// Get category by slug
export const getCategoryBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Category>('/categories/get-by-slug/' + slug, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategoryBySlug:", error);
        throw error;
    }
};

// Get all none-deleted categories
export const getNoneDeleteCategories = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Category>>('/categories/none-delete', {
            params: {
                page,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getNoneDeleteCategories:", error);
        throw error;
    }
};

// Create new category
export const createCategory = async (categoryData: Omit<Category, 'id' | 'createdDate' | 'lastUpdated'>) => {
    try {
        const response = await coursesHttp.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

// Update category (full update)
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdDate' | 'lastUpdated'>>) => {
    try {
        const response = await coursesHttp.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Patch category (partial update)
export const patchCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdDate' | 'lastUpdated'>>) => {
    try {
        const response = await coursesHttp.patch(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error patching category:', error);
        throw error;
    }
};

// Delete category
export const deleteCategory = async (id: string) => {
    try {
        const response = await coursesHttp.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

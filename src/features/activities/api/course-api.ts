import { Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { springHttp } from "@/utils/http";

export const getCategories = async (page: number, size: number, signal?: AbortSignal) => {
    try {
        const response = await springHttp.get<PagedResult<Category>>('/categories', {
            params: {
                page,
                size,
            },
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        console.error("API Error in getAllCategories:", error);
        throw error;
    }
};

export const getCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await springHttp.get<PagedResult<Course>>('/courses', {
            params: {
                page,
                size,
                search
            },
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        console.error("API Error in getAllActiveCourses:", error);
        throw error;
    }
};

export const getCourseBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await springHttp.get<Course>('/courses/get-by-slug/' + slug, {
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        console.error("API Error in getActiveCourseBySlug:", error);
        throw error;
    }
}

export const getCategoryBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await springHttp.get<Category>('/categories/get-by-slug/' + slug, {
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        console.error("API Error in getCategoryBySlug:", error);
        throw error;
    }
}
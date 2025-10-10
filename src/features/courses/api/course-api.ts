import { AccountCourse, AccountLesson, Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";
import { getMockAccountCourses } from "./account-courses";
import { getMockAccountLessons, markMockLessonComplete } from "./account-lessons";

export const getCategories = async (page: number, size: number, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Category>>('/categories', {
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
        const response = await coursesHttp.get<PagedResult<Course>>('/courses', {
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
        const response = await coursesHttp.get<Course>('/courses/get-by-slug/' + slug, {
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
        const response = await coursesHttp.get<Category>('/categories/get-by-slug/' + slug, {
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        console.error("API Error in getCategoryBySlug:", error);
        throw error;
    }
}

export const getAccountCourses = async (accountId: string, page: number, size: number, signal?: AbortSignal): Promise<PagedResult<AccountCourse>> => {
    try {
        return getMockAccountCourses(accountId, page, size, signal);
    }
    catch (error) {
        console.error("API Error in getAccountCourses:", error);
        throw error;
    }
}

export const getAccountLessons = async (accountId: string, courseId: string, page: number, size: number, signal?: AbortSignal): Promise<PagedResult<AccountLesson>> => {
    try {
        return getMockAccountLessons(accountId, courseId, page, size, signal);
    }
    catch (error) {
        console.error("API Error in getAccountLessons:", error);
        throw error;
    }
}

export const markLessonComplete = async (accountLessonId: string, signal?: AbortSignal): Promise<void> => {
    try {
        return markMockLessonComplete(accountLessonId, signal);
    }
    catch (error) {
        console.error("API Error in markLessonComplete:", error);
        throw error;
    }
}
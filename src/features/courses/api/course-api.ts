import { Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// GET /api/v1/courses - Get all active courses with pagination
export const getCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses', {
            params: {
                page,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCourses:", error);
        throw error;
    }
};

// GET /api/v1/courses/get-by-slug/{slug} - Get active course by slug
export const getCourseBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Course>('/courses/get-by-slug/' + slug, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCourseBySlug:", error);
        throw error;
    }
};

// GET /api/v1/courses/none-delete - Get all none delete courses
export const getNoneDeleteCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses/none-delete', {
            params: {
                page,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getNoneDeleteCourses:", error);
        throw error;
    }
};

// GET /api/v1/courses/none-delete/{id} - Get none delete course by id
export const getNoneDeleteCourseById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Course>(`/courses/none-delete/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getNoneDeleteCourseById:", error);
        throw error;
    }
};

// GET /api/v1/courses/{id} - Get active course by id
export const getCourseById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Course>(`/courses/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCourseById:", error);
        throw error;
    }
};

// POST /api/v1/courses - Create new course
export const createCourse = async (courseData: Partial<Course>) => {
    try {
        const response = await coursesHttp.post<Course>('/courses', courseData);
        return response.data;
    } catch (error) {
        console.error("API Error in createCourse:", error);
        throw error;
    }
};

// PUT /api/v1/courses/{id} - Update course by id
export const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
        const response = await coursesHttp.put<Course>(`/courses/${id}`, courseData);
        return response.data;
    } catch (error) {
        console.error("API Error in updateCourse:", error);
        throw error;
    }
};

// PATCH /api/v1/courses/{id} - Patch update course by id
export const patchCourse = async (id: string, courseData: Partial<Course>) => {
    try {
        const response = await coursesHttp.patch<Course>(`/courses/${id}`, courseData);
        return response.data;
    } catch (error) {
        console.error("API Error in patchCourse:", error);
        throw error;
    }
};

// DELETE /api/v1/courses/{id} - Delete course by id
export const deleteCourse = async (id: string) => {
    try {
        const response = await coursesHttp.delete(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteCourse:", error);
        throw error;
    }
};


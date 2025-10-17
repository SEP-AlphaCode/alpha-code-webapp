import { Lesson } from "@/types/lesson";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// GET /api/v1/lessons/get-by-course/{courseId} - Get all active lessons by course id with pagination
export const getLessons = async (
    courseId: string, 
    page: number = 1, 
    size: number = 10, 
    signal?: AbortSignal
) => {
    try {
        const response = await coursesHttp.get<PagedResult<Lesson>>(`/lessons/get-by-course/${courseId}`, {
            params: {
                page,
                size
            },
            signal
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object') {
            const errorObj = error as { name?: string; code?: string };
            if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
                console.log('API Call canceled');
                return Promise.reject(error);
            }
        }
        console.error("API Error in getLessons:", error);
        throw error;
    }
};

// GET /api/v1/lessons/all-with-solution-by-course/{courseId} - Get all lessons with solutions by course id (Admin and Staff only)
export const getAllLessonsWithSolution = async (courseId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson[]>(`/lessons/all-with-solution-by-course/${courseId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getAllLessonsWithSolution:", error);
        throw error;
    }
};

// GET /api/v1/lessons/{id} - Get active lesson by id
export const getLessonById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson>(`/lessons/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonById:", error);
        throw error;
    }
};

// GET /api/v1/lessons/with-solution/{id} - Get lesson with solution by id (Admin and Staff only)
export const getLessonWithSolution = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson>(`/lessons/with-solution/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonWithSolution:", error);
        throw error;
    }
};

// POST /api/v1/lessons - Create a new lesson (Admin and Staff only)
export const createLesson = async (lessonData: Partial<Lesson>) => {
    try {
        const response = await coursesHttp.post<Lesson>('/lessons', lessonData);
        return response.data;
    } catch (error) {
        console.error("API Error in createLesson:", error);
        throw error;
    }
};

// PUT /api/v1/lessons/{lessonId} - Update a lesson (Admin and Staff only)
export const updateLesson = async (id: string, lessonData: Partial<Lesson>) => {
    try {
        const response = await coursesHttp.put<Lesson>(`/lessons/${id}`, lessonData);
        return response.data;
    } catch (error) {
        console.error("API Error in updateLesson:", error);
        throw error;
    }
};

// PATCH /api/v1/lessons/{lessonId} - Patch a lesson (Admin and Staff only)
export const patchLesson = async (id: string, lessonData: Partial<Lesson>) => {
    try {
        const response = await coursesHttp.patch<Lesson>(`/lessons/${id}`, lessonData);
        return response.data;
    } catch (error) {
        console.error("API Error in patchLesson:", error);
        throw error;
    }
};

// DELETE /api/v1/lessons/{lessonId} - Delete a lesson (Admin and Staff only)
export const deleteLesson = async (id: string) => {
    try {
        const response = await coursesHttp.delete(`/lessons/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteLesson:", error);
        throw error;
    }
};

import { Lesson } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// Get lessons with solution by course ID
export const getLessonsByCourseId = async (courseId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Lesson>>(`/lessons/all-with-solution-by-course/${courseId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonsByCourseId:", error);
        throw error;
    }
};

// Get lessons with solution by section ID
export const getLessonsBySectionId = async (courseId: string, sectionId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson[]>(`/lessons/all-with-solution-by-section/${sectionId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonsBySectionId:", error);
        throw error;
    }
};

// Get all lessons with filters
export const getAllLessons = async (params?: {
    page?: number;
    size?: number;
    search?: string;
    courseId?: string;
    sectionId?: string;
    type?: number;
    requireRobot?: boolean;
}, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Lesson>>('/lessons', {
            params,
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getAllLessons:", error);
        throw error;
    }
};

// Get lesson by ID
export const getLessonById = async (lessonId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson>(`/lessons/${lessonId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonById:", error);
        throw error;
    }
};

// Create new lesson
export const createLesson = async (courseId: string, sectionId: string, data: {
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    requireRobot: boolean;
    type: number;
    orderNumber: number;
    solution?: object;
}) => {
    try {
        const response = await coursesHttp.post<Lesson>(`/courses/${courseId}/sections/${sectionId}/lessons`, data);
        return response.data;
    } catch (error) {
        console.error("API Error in createLesson:", error);
        throw error;
    }
};

// Update lesson
export const updateLesson = async (lessonId: string, data: {
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    requireRobot: boolean;
    type: number;
    orderNumber: number;
    sectionId?: string;
    solution?: unknown;
}) => {
    try {
        const response = await coursesHttp.put<Lesson>(`/lessons/${lessonId}`, data);
        return response.data;
    } catch (error) {
        console.error("API Error in updateLesson:", error);
        throw error;
    }
};

// Delete lesson
export const deleteLesson = async (lessonId: string) => {
    try {
        const response = await coursesHttp.delete(`/lessons/${lessonId}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteLesson:", error);
        throw error;
    }
};

// Update lesson order (reorder lessons within section or move between sections)
export const updateLessonOrder = async (
    sectionId: string, 
    lessons: Array<{ id: string; orderNumber: number; sectionId: string }>
) => {
    try {
        const response = await coursesHttp.put(`/sections/${sectionId}/lessons/reorder`, { lessons });
        return response.data;
    } catch (error) {
        console.error("API Error in updateLessonOrder:", error);
        throw error;
    }
};

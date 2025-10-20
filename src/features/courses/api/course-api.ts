import { Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";


// Get none delete courses with pagination
export const getNoneDeleteCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses/none-delete', {
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
        console.error("API Error in getNoneDeleteCourses:", error);
        throw error;
    }
}

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


// Create new course
export const createCourse = async (data: FormData) => {
    try {
        const response = await coursesHttp.post<Course>('/courses', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error in createCourse:", error);
        throw error;
    }
};

// Update course
export const updateCourse = async (id: string, data: {
    name: string;
    description: string;
    categoryId: string;
    level: number;
    price: number;
    image?: string;
    status?: number;
}) => {
    try {
        const response = await coursesHttp.put<Course>(`/courses/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("API Error in updateCourse:", error);
        throw error;
    }
};

// Delete course
export const deleteCourse = async (id: string) => {
    try {
        const response = await coursesHttp.delete(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteCourse:", error);
        throw error;
    }
};

// Get course by ID (for editing)
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

// Get dashboard statistics for staff
export const getStaffDashboardStats = async (signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<{
            totalCategories: number;
            totalCourses: number;
            totalSections: number;
            totalLessons: number;
        }>('courses/dashboard/stats', {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getStaffDashboardStats:", error);
        throw error;
    }
};

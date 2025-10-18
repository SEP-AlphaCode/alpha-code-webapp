import { Section } from "@/types/section";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// POST /api/v1/sections - Create a new section (Admin and Staff only)
export const createSection = async (sectionData: Partial<Section>) => {
    try {
        const response = await coursesHttp.post<Section>('/sections', sectionData);
        return response.data;
    } catch (error) {
        console.error("API Error in createSection:", error);
        throw error;
    }
};

// GET /api/v1/sections/get-by-course/{courseId} - Get all sections by course id
export const getSectionsByCourseId = async (courseId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Section>>(`/sections/get-by-course/${courseId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getSectionsByCourseId:", error);
        throw error;
    }
};

// GET /api/v1/sections/{id} - Get section by id
export const getSectionById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Section>(`/sections/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getSectionById:", error);
        throw error;
    }
};

// PUT /api/v1/sections/{sectionId} - Update a section (Admin and Staff only)
export const updateSection = async (sectionId: string, sectionData: Partial<Section>) => {
    try {
        const response = await coursesHttp.put<Section>(`/sections/${sectionId}`, sectionData);
        return response.data;
    } catch (error) {
        console.error("API Error in updateSection:", error);
        throw error;
    }
};

// DELETE /api/v1/sections/{sectionId} - Delete a section (Admin and Staff only)
export const deleteSection = async (sectionId: string) => {
    try {
        const response = await coursesHttp.delete(`/sections/${sectionId}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteSection:", error);
        throw error;
    }
};

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

// Get lesson with solution by slug (for staff/admin)
export const getLessonBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson>(`/lessons/with-solution/slug/${slug}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonBySlug:", error);
        throw error;
    }
};

// Create new lesson
export const createLesson = async (sectionId: string, data: {
    title: string;
    content: string;
    videoFile?: File;
    duration: number;
    requireRobot: boolean;
    type: number;
    solution?: object;
}) => {
    try {
        const formData = new FormData();
        
        // Create the createLesson object
        const createLessonDto = {
            title: data.title,
            content: data.content,
            duration: data.duration,
            requireRobot: data.requireRobot,
            sectionId: sectionId,
            type: data.type,
            solution: data.solution || null
        };
        
        // Add JSON data as blob
        formData.append('createLesson', new Blob([JSON.stringify(createLessonDto)], {
            type: 'application/json'
        }));
        
        // Add video file if provided
        if (data.videoFile) {
            formData.append('videoFile', data.videoFile);
        }
        
        const response = await coursesHttp.post<Lesson>('/lessons', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error in createLesson:", error);
        throw error;
    }
};

// Update lesson
// Update lesson (multipart/form-data)
export const updateLesson = async (
  lessonId: string,
  data: {
    id: string;
    title: string;
    content: string;
    videoFile?: File; // đổi từ videoUrl sang videoFile nếu upload lại
    duration: number;
    requireRobot: boolean;
    type: number;
    orderNumber: number;
    sectionId?: string;
    solution?: object | null;
    status: number;
  }
) => {
  try {
    const formData = new FormData();

    // Tạo DTO để gửi cùng file
    const updateLessonDto = {
        id: data.id,
      title: data.title,
      content: data.content,
      duration: data.duration,
      requireRobot: data.requireRobot,
      type: data.type,
      orderNumber: data.orderNumber,
      sectionId: data.sectionId || null,
      solution: data.solution || null,
    status: data.status,
    };

    // Thêm DTO vào formData
    formData.append(
      "updateLesson",
      new Blob([JSON.stringify(updateLessonDto)], { type: "application/json" })
    );

    // Nếu có videoFile mới, thêm vào
    if (data.videoFile) {
      formData.append("videoFile", data.videoFile);
    }

    // Gửi request PUT với multipart/form-data
    const response = await coursesHttp.put<Lesson>(
      `/lessons/${lessonId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
        const response = await coursesHttp.put(`/lessons/${sectionId}/lessons/reorder`, { lessons });
        return response.data;
    } catch (error) {
        console.error("API Error in updateLessonOrder:", error);
        throw error;
    }
};

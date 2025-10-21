import { AccountCourse } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

export const getAccountCourses = async (accountId: string, page: number, size: number, signal?: AbortSignal): Promise<PagedResult<AccountCourse>> => {
    try {
        const response = await coursesHttp.get<PagedResult<AccountCourse>>('/account-courses/by-account/' + accountId)
        return response.data
    }
    catch (error) {
        console.error("API Error in getAccountCourses:", error);
        throw error;
    }
}
import { AccountCourse } from '@/types/accountCourse';
import { coursesHttp } from '@/utils/http';

// POST /api/v1/account-courses - Create new account course
export const createAccountCourse = async (accountCourseData: Omit<AccountCourse, 'id' | 'purchasedDate' | 'lastAccessed'>) => {
  try {
    const response = await coursesHttp.post<AccountCourse>('/account-courses', accountCourseData);
    return response.data;
  } catch (error) {
    console.error('Error creating account course:', error);
    throw error;
  }
};

// GET /api/v1/account-courses/by-account/{accountId} - Get list of account courses by account id
export const getAccountCoursesByAccountId = async (accountId: string, signal?: AbortSignal) => {
  try {
    const response = await coursesHttp.get<AccountCourse[]>(`/account-courses/by-account/${accountId}`, {
      signal,
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
    console.error('Error fetching account courses by account id:', error);
    throw error;
  }
};

// POST /api/v1/account-courses/from-bundle - Create new account courses from bundle
export const createAccountCoursesFromBundle = async (bundleData: { accountId: string; bundleId: string }) => {
  try {
    const response = await coursesHttp.post<AccountCourse[]>('/account-courses/from-bundle', bundleData);
    return response.data;
  } catch (error) {
    console.error('Error creating account courses from bundle:', error);
    throw error;
  }
};

// DELETE /api/v1/account-courses/{id} - Delete account course
export const deleteAccountCourse = async (id: string) => {
  try {
    const response = await coursesHttp.delete(`/account-courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting account course:', error);
    throw error;
  }
};

// GET /api/v1/account-courses/{id} - Get account course by id
export const getAccountCourseById = async (id: string) => {
  try {
    const response = await coursesHttp.get<AccountCourse>(`/account-courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account course by id:', error);
    throw error;
  }
};

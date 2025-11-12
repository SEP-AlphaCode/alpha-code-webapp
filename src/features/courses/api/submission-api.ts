import { Submission } from '@/types/submission'
import { coursesHttp } from '@/utils/http'

// Create a new submission
export const createSubmission = async (data: {
  accountLessonId: string
  logData?: string
  videoUrl?: string
  status?: number
}) => {
  try {
    const response = await coursesHttp.post<Submission>('/submissions', data)
    return response.data
  } catch (error) {
    console.error('API Error in createSubmission:', error)
    throw error
  }
}

// Get newest submission by account lesson ID
export const getNewestSubmissionByAccountLessonId = async (
  accountLessonId: string,
  signal?: AbortSignal
) => {
  try {
    const response = await coursesHttp.get<Submission>(
      `/submissions/by-account-lesson-id/${accountLessonId}`,
      { signal }
    )
    return response.data
  } catch (error) {
    console.error('API Error in getNewestSubmissionByAccountLessonId:', error)
    throw error
  }
}

// Staff review a submission
export const reviewSubmission = async (
  submissionId: string,
  data: {
    status?: number
    statusText?: string
  }
) => {
  try {
    const response = await coursesHttp.put<Submission>(
      `/submissions/${submissionId}/review`,
      data
    )
    return response.data
  } catch (error) {
    console.error('API Error in reviewSubmission:', error)
    throw error
  }
}

import { useQuery } from '@tanstack/react-query';
import { apiCoursesUrl } from '@/app/constants/constants';

export interface VideoSubmissionDetail {
    id: string;
    accountLessonId: string;
    accountId: string;
    accountName: string;
    lessonId: string;
    lessonTitle: string;
    logData: string;
    videoUrl: string;
    status: number;
    statusText: string;
    staffComment?: string | null;
    missingActions?: string | null;
    createdDate: string;
    lastUpdated: string;
}

export const useVideoSubmission = (submissionId: string) => {
    return useQuery<VideoSubmissionDetail>({
        queryKey: ['video-submission', submissionId],
        queryFn: async () => {
            const response = await fetch(
                `${apiCoursesUrl}/staff/submissions/video/${submissionId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch video submission');
            }

            return response.json();
        },
        enabled: !!submissionId,
    });
};

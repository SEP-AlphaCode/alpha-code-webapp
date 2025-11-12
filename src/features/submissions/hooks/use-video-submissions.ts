import { useQuery } from '@tanstack/react-query';
import { apiCoursesUrl } from '@/app/constants/constants';

export interface VideoSubmissionListItem {
    id: string;
    accountLessonId: string;
    accountId: string;
    accountName: string;
    lessonId: string;
    lessonTitle: string;
    videoUrl: string;
    status: number;
    statusText: string;
    createdDate: string;
    lastUpdated: string;
}

export const useVideoSubmissions = () => {
    return useQuery<VideoSubmissionListItem[]>({
        queryKey: ['video-submissions'],
        queryFn: async () => {
            const response = await fetch(`${apiCoursesUrl}/staff/submissions/video`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch video submissions');
            }

            return response.json();
        },
    });
};

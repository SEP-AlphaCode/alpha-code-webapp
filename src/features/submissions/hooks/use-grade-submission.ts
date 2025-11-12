import { useMutation } from '@tanstack/react-query';
import { apiCoursesUrl } from '@/app/constants/constants';

interface GradeSubmissionParams {
    submissionId: string;
    status: number; // 1 = PASS, 2 = FAIL
    staffComment?: string;
}

export const useGradeSubmission = () => {
    return useMutation({
        mutationFn: async ({ submissionId, status, staffComment }: GradeSubmissionParams) => {
            const response = await fetch(
                `${apiCoursesUrl}/staff/submissions/video/${submissionId}/grade`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        status,
                        staffComment,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to grade submission');
            }

            return response.json();
        },
    });
};

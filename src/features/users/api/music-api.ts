import { AudioConvertRequest, AudioConvertResponse, DancePlanReposnse } from '@/types/music';
import { pythonHttp, usersHttp } from '@/utils/http';

// Audio conversion API
export const convertAudioToWav = async (params: AudioConvertRequest): Promise<AudioConvertResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', params.file);
        
        if (params.start_time !== undefined) {
            formData.append('start_time', params.start_time.toString());
        }
        
        if (params.end_time !== undefined) {
            formData.append('end_time', params.end_time.toString());
        }

        const response = await usersHttp.post<AudioConvertResponse>('/audio/convert/to-wav', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 300000, // 5 minutes timeout for file conversion
        });
        
        return response.data;
    } catch (error) {
        console.error('Error converting audio:', error);
        throw error;
    }
};  

export const getDancePlan = async (
    file: File, 
    robot_model_id: string,
    start_time?: number, 
    end_time?: number
): Promise<DancePlanReposnse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add optional start_time and end_time to form data
        if (start_time !== undefined && start_time !== null) {
            formData.append('start_time', start_time.toString());
        }
        
        if (end_time !== undefined && end_time !== null) {
            formData.append('end_time', end_time.toString());
        }

        formData.append('robot_model_id', robot_model_id);
        
        const response = await pythonHttp.post('/music/upload-music-and-generate-plan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 300000, // 5 minutes timeout for dance plan generation 
        });
        return response.data;
    } catch (error) {
        console.error('Error generating dance plan:', error);
        throw error;
    }
};
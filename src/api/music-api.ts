import { Music, MusicResponse, AudioConvertRequest, AudioConvertResponse, DancePlanReposnse } from '@/types/music';
import { pythonHttp, springHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

export const getAllMusics = async () => {
  try {
    const response = await springHttp.get<PagedResult<Music>>('/musics');
    return response.data;
  } catch (error) {
    console.error('Error fetching all musics:', error);
    throw error;
  }
};

export const getPagedMusics = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await springHttp.get<MusicResponse>('/musics', {
      params: {
        page,
        size,
        search
      },
      signal
    });
    return response.data;
    } catch (error) {       
    console.error('Error fetching paged musics:', error);
    throw error;
  }
};
export const getMusicById = async (id: string) => {
    const response = await springHttp.get<Music>(`/musics/${id}`);
    return response.data;
};
export const createMusic = async (musicData: Omit<Music, 'id' | 'createdDate' | 'lastUpdate'>) => {
    const response = await springHttp.post('/musics', musicData);
    return response.data;
};
export const updateMusic = async (id: string, musicData: Partial<Omit<Music, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    const response = await springHttp.patch(`/musics/${id}`, musicData);
    return response.data;
};
export const deleteMusic = async (id: string) => {
    const response = await springHttp.delete(`/musics/${id}`);
    return response.data;
};

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

        const response = await springHttp.post<AudioConvertResponse>('/audio/convert/to-wav', formData, {
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
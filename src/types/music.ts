export type Music = {
    id: string;
    classId: string;
    className: string;
    createdDate: string;
    duration: number; 
    image: string;
    lastUpdate: string;
    name: string;
    status: number;
    statusText: string;
    url: string;
}

export type MusicResponse = {
    data: Music[];
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}


// Audio conversion API types
export type AudioConvertRequest = {
    file: File;
    start_time?: number;
    end_time?: number;
}

export type AudioConvertResponse = {
    message: string;
    file_name: string;
    url: string;
    duration: number;
    trimming_applied?: {
        start_time: number;
        end_time: number;
    };
}
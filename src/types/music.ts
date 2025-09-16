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

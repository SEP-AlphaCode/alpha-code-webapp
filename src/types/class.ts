export type ClassTeacher = {
    classId: string;
    className: string;
    createdDate: string;
    lastUpdate: string;
    status: number;
    statusText: string;
    teacherId: string;
    teacherName: string;
}

export type Class = {
    id: string;
    name: string;
    status: number;
    statusText: string;
    createdDate: string;
    lastUpdate: string;
    teachers: ClassTeacher[];
}

export type ClassResponse = {
    data: Class[];
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

export function mapDifficulty(d: number) {
    switch (d) {
        case 1: return {
            text: 'Beginner',
            textColor: 'blue-500'
        }
        case 2: return {
            text: 'Intermediate',
            textColor: 'green-500'
        }
        case 3: return {
            text: 'Advanced',
            textColor: 'yellow-500'
        }
    }
    return {
        text: 'Expert',
        textColor: 'red-500'
    }
}

export function formatTimespan(seconds: number): string {
    if (seconds < 0) {
        throw new Error('Seconds cannot be negative');
    }

    if (seconds === 0) {
        return '0s';
    }

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    const parts: string[] = [];

    if (days > 0) {
        parts.push(`${days}d`);
    }
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}m`);
    }
    if (remainingSeconds > 0 || parts.length === 0) {
        parts.push(`${remainingSeconds}s`);
    }

    return parts.join('');
}
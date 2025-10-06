export type Category = {
    id: string,
    name: string,
    description: string,
    slug: string,
    imageUrl: string,
    status: number,
    lastUpdated?: string,
    createdDate: string
}

export interface Lesson {
    id: string; // uuid
    courseId: string; // uuid
    title: string; // varchar(255)
    contentUrl?: string; // varchar(255) - nullable
    requireRobot: boolean; // bool
    duration: number; // int4 (in seconds)
    content?: string; // varchar(255) - nullable
    contentType: string; // varchar(255)
    orderNumber: number; // int4
    solution?: unknown; // jsonb - nullable, can be more specific based on your JSON structure
}

export interface Course {
    id: string; // uuid
    name: string; // varchar(255)
    description: string; // varchar(max) - assuming nullable
    price: number; // numeric(19, 2)
    requireLicense: boolean; // bool
    level: number; // int4
    totalLessons: number; // int4
    status: number; // int4
    createdDate: string; // timestamp
    lastUpdated?: string; // timestamp
    totalDuration: number; // int4
    categoryId: string; // uuid
    slug: string; // varchar(255)
    imageUrl?: string; // varchar(255) - assuming nullable
    lessons?: Lesson[]
}

export function mapDifficulty(d: number) {
    switch (d) {
        case 3: return {
            text: 'Cơ bản',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
        case 4: return {
            text: 'Trung bình',
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        }
        case 5: return {
            text: 'Nâng cao',
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        }
    }
    return {
        text: '',
        color: 'text-red-500',
        bg: 'bg-red-500/10'
    }
}

//Round to nearest hour
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

    if (days > 0) {
        if (hours >= 12) {
            return `${days} ngày ${hours} giờ`;
        }
        return `${days} ngày`;
    }
    if (hours > 0) {
        if (minutes >= 15) {
            return `${hours} giờ ${minutes} phút`;
        }
        return `${hours} phút`;
    }
    if (minutes > 0) {
        return `${minutes} phút`;
    }
    return `${remainingSeconds} giây`;
}

export function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
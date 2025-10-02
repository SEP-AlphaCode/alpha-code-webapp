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
  solution?: any; // jsonb - nullable, can be more specific based on your JSON structure
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
        case 1: return {
            text: 'Cơ bản',
            color: 'blue-500'
        }
        case 2: return {
            text: 'Trung bình',
            color: 'green-500'
        }
        case 3: return {
            text: 'Nâng cao',
            color: 'yellow-500'
        }
    }
    return {
        text: '',
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

export function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
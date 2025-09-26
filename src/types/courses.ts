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
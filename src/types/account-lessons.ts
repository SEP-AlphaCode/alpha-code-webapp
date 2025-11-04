import { Lesson } from "./courses"

export type AccountLesson = {
    accountId: string
    id: string
    completedAt?: string // timestamp
    lessonId: string
    status: number // int4
    typeStatus: string
    lesson: Lesson
}
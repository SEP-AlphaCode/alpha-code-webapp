
import { ClassDto } from "@/types/class-entity"
import type { PagedResult } from "@/types/page-result"
import { TeacherClassDto } from "@/types/teacher"

// Mock data for classes
const mockTeachers: TeacherClassDto[] = [
    {
        teacherId: "550e8400-e29b-41d4-a716-446655440001",
        teacherName: "Dr. Sarah Johnson",
        classId: "550e8400-e29b-41d4-a716-446655440010",
        className: "Mathematics Grade 10",
        status: 1,
        statusText: "Active",
        createdDate: "2024-01-10T09:00:00Z",
        lastUpdate: "2024-01-15T10:30:00Z",
    },
    {
        teacherId: "550e8400-e29b-41d4-a716-446655440002",
        teacherName: "Prof. Michael Chen",
        classId: "550e8400-e29b-41d4-a716-446655440011",
        className: "Physics Grade 11",
        status: 1,
        statusText: "Active",
        createdDate: "2024-01-11T08:30:00Z",
        lastUpdate: "2024-01-16T14:20:00Z",
    },
    {
        teacherId: "550e8400-e29b-41d4-a716-446655440003",
        teacherName: "Dr. Emily Rodriguez",
        classId: "550e8400-e29b-41d4-a716-446655440012",
        className: "Chemistry Grade 12",
        status: 0,
        statusText: "Inactive",
        createdDate: "2024-01-12T10:15:00Z",
        lastUpdate: "2024-01-17T16:45:00Z",
    },
]

const mockClasses: ClassDto[] = [
    {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "Mathematics Grade 10",
        createdDate: "2024-01-10T09:00:00Z",
        lastUpdate: "2024-01-15T10:30:00Z",
        status: 1,
        statusText: "Active",
        teachers: [mockTeachers[0]],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Physics Grade 11",
        createdDate: "2024-01-11T08:30:00Z",
        lastUpdate: "2024-01-16T14:20:00Z",
        status: 1,
        statusText: "Active",
        teachers: [mockTeachers[1]],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Chemistry Grade 12",
        createdDate: "2024-01-12T10:15:00Z",
        status: 0,
        statusText: "Inactive",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440013",
        name: "Biology Advanced",
        createdDate: "2024-01-13T11:00:00Z",
        lastUpdate: "2024-01-18T09:30:00Z",
        status: 1,
        statusText: "Active",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440014",
        name: "English Literature",
        createdDate: "2024-01-14T13:20:00Z",
        status: 1,
        statusText: "Active",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "Mathematics Grade 10",
        createdDate: "2024-01-10T09:00:00Z",
        lastUpdate: "2024-01-15T10:30:00Z",
        status: 1,
        statusText: "Active",
        teachers: [mockTeachers[0]],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Physics Grade 11",
        createdDate: "2024-01-11T08:30:00Z",
        lastUpdate: "2024-01-16T14:20:00Z",
        status: 1,
        statusText: "Active",
        teachers: [mockTeachers[1]],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Chemistry Grade 12",
        createdDate: "2024-01-12T10:15:00Z",
        lastUpdate: "2024-01-17T16:45:00Z",
        status: 0,
        statusText: "Inactive",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440013",
        name: "Biology Advanced",
        createdDate: "2024-01-13T11:00:00Z",
        lastUpdate: "2024-01-18T09:30:00Z",
        status: 1,
        statusText: "Active",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440014",
        name: "English Literature",
        createdDate: "2024-01-14T13:20:00Z",
        lastUpdate: "2024-01-19T15:10:00Z",
        status: 1,
        statusText: "Active",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "Mathematics Grade 10",
        createdDate: "2024-01-10T09:00:00Z",
        status: 1,
        statusText: "Active",
        teachers: [mockTeachers[0], mockTeachers[1]],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Physics Grade 11",
        createdDate: "2024-01-11T08:30:00Z",
        lastUpdate: "2024-01-16T14:20:00Z",
        status: 1,
        statusText: "Active",
        teachers: [mockTeachers[1]],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Chemistry Grade 12",
        createdDate: "2024-01-12T10:15:00Z",
        lastUpdate: "2024-01-17T16:45:00Z",
        status: 0,
        statusText: "Inactive",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440013",
        name: "Biology Advanced",
        createdDate: "2024-01-13T11:00:00Z",
        lastUpdate: "2024-01-18T09:30:00Z",
        status: 1,
        statusText: "Active",
        teachers: [],
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440014",
        name: "English Literature",
        createdDate: "2024-01-14T13:20:00Z",
        status: 1,
        statusText: "Active",
        teachers: [],
    },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAllClasses = async (page = 1, perPage = 10): Promise<PagedResult<ClassDto>> => {
    await delay(500) // Simulate network delay

    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = mockClasses.slice(startIndex, endIndex)

    return {
        data: paginatedData,
        total_count: mockClasses.length,
        page: page,
        per_page: perPage,
        total_pages: Math.ceil(mockClasses.length / perPage),
        has_next: endIndex < mockClasses.length,
        has_previous: page > 1,
    }
}

export const getClassById = async (id: string): Promise<ClassDto> => {
    await delay(300)

    const classItem = mockClasses.find((c) => c.id === id)
    if (!classItem) {
        throw new Error(`Class with id ${id} not found`)
    }

    return classItem
}

export const createClass = async (
    classData: Omit<ClassDto, "id" | "createdDate" | "lastUpdate" | "statusText">,
): Promise<ClassDto> => {
    await delay(800)

    const newClass: ClassDto = {
        id: `550e8400-e29b-41d4-a716-${Date.now()}`,
        ...classData,
        createdDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        statusText: classData.status === 1 ? "Active" : "Inactive",
    }

    mockClasses.push(newClass)
    return newClass
}

export const updateClass = async (
    id: string,
    classData: Partial<Omit<ClassDto, "id" | "createdDate">>,
): Promise<ClassDto> => {
    await delay(600)

    const classIndex = mockClasses.findIndex((c) => c.id === id)
    if (classIndex === -1) {
        throw new Error(`Class with id ${id} not found`)
    }

    const updatedClass = {
        ...mockClasses[classIndex],
        ...classData,
        lastUpdate: new Date().toISOString(),
        statusText:
            classData.status !== undefined
                ? classData.status === 1
                    ? "Active"
                    : "Inactive"
                : mockClasses[classIndex].statusText,
    }

    mockClasses[classIndex] = updatedClass
    return updatedClass
}

export const deleteClass = async (id: string): Promise<void> => {
    await delay(400)

    const classIndex = mockClasses.findIndex((c) => c.id === id)
    if (classIndex === -1) {
        throw new Error(`Class with id ${id} not found`)
    }

    mockClasses.splice(classIndex, 1)
}

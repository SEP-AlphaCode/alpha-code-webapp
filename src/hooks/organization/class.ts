
import { Classroom } from "@/types/class-entity"
import type { PagedResult } from "@/types/page-result"

// Mock data for classrooms with enough entries to test pagination
const mockClassrooms: Classroom[] = [
  {
    id: "1",
    name: "Classroom A",
    building: "Building A",
    room: "A101",
    capacity: 20,
    currentStudents: 18,
    teacher: {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@school.edu",
    },
    assignedRobots: [
      { id: "1", name: "Alpha-01", status: "online" },
      { id: "2", name: "Alpha-02", status: "offline" },
    ],
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "10:30", subject: "Language Arts" },
      { day: "Monday", startTime: "12:00", endTime: "13:30", subject: "Physics" },
      { day: "Wednesday", startTime: "09:00", endTime: "10:30", subject: "Science" },
      { day: "Friday", startTime: "09:00", endTime: "10:30", subject: "Math" },
    ],
    activities: 45,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Classroom B",
    building: "Building A",
    room: "A102",
    capacity: 25,
    currentStudents: 22,
    teacher: {
      id: "2",
      name: "Mike Chen",
      email: "mike.chen@school.edu",
    },
    assignedRobots: [{ id: "3", name: "Alpha-03", status: "maintenance" }],
    schedule: [
      { day: "Tuesday", startTime: "10:00", endTime: "11:30", subject: "Language Arts" },
      { day: "Thursday", startTime: "10:00", endTime: "11:30", subject: "Creative Arts" },
    ],
    activities: 32,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Classroom C",
    building: "Building B",
    room: "B201",
    capacity: 15,
    currentStudents: 12,
    teacher: {
      id: "3",
      name: "Emily Davis",
      email: "emily.davis@school.edu",
    },
    assignedRobots: [{ id: "4", name: "Alpha-04", status: "online" }],
    schedule: [
      { day: "Monday", startTime: "14:00", endTime: "15:30", subject: "STEM" },
      { day: "Wednesday", startTime: "14:00", endTime: "15:30", subject: "Social Studies" },
    ],
    activities: 28,
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Classroom D",
    building: "Building B",
    room: "B202",
    capacity: 30,
    currentStudents: 25,
    teacher: {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@school.edu",
    },
    assignedRobots: [
      { id: "5", name: "Alpha-05", status: "online" },
      { id: "6", name: "Alpha-06", status: "online" },
    ],
    schedule: [
      { day: "Tuesday", startTime: "13:00", endTime: "14:30", subject: "Mathematics" },
      { day: "Thursday", startTime: "13:00", endTime: "14:30", subject: "Physics" },
      { day: "Friday", startTime: "13:00", endTime: "14:30", subject: "Chemistry" },
    ],
    activities: 67,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    name: "Classroom E",
    building: "Building C",
    room: "C301",
    capacity: 18,
    currentStudents: 16,
    teacher: {
      id: "5",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@school.edu",
    },
    assignedRobots: [{ id: "7", name: "Alpha-07", status: "offline" }],
    schedule: [
      { day: "Monday", startTime: "11:00", endTime: "12:30", subject: "Biology" },
      { day: "Friday", startTime: "11:00", endTime: "12:30", subject: "Environmental Science" },
    ],
    activities: 23,
    status: "inactive",
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    name: "Classroom F",
    building: "Building C",
    room: "C302",
    capacity: 22,
    currentStudents: 20,
    teacher: {
      id: "6",
      name: "James Thompson",
      email: "james.thompson@school.edu",
    },
    assignedRobots: [
      { id: "8", name: "Alpha-08", status: "online" },
      { id: "9", name: "Alpha-09", status: "maintenance" },
    ],
    schedule: [
      { day: "Wednesday", startTime: "08:00", endTime: "09:30", subject: "History" },
      { day: "Friday", startTime: "08:00", endTime: "09:30", subject: "Geography" },
    ],
    activities: 41,
    status: "active",
    createdAt: "2024-03-05",
  },
  {
    id: "7",
    name: "Classroom G",
    building: "Building A",
    room: "A103",
    capacity: 24,
    currentStudents: 19,
    teacher: {
      id: "7",
      name: "Maria Garcia",
      email: "maria.garcia@school.edu",
    },
    assignedRobots: [{ id: "10", name: "Alpha-10", status: "online" }],
    schedule: [
      { day: "Tuesday", startTime: "15:00", endTime: "16:30", subject: "Art" },
      { day: "Thursday", startTime: "15:00", endTime: "16:30", subject: "Music" },
    ],
    activities: 35,
    status: "active",
    createdAt: "2024-01-30",
  },
  {
    id: "8",
    name: "Classroom H",
    building: "Building B",
    room: "B203",
    capacity: 16,
    currentStudents: 14,
    teacher: {
      id: "8",
      name: "Robert Brown",
      email: "robert.brown@school.edu",
    },
    assignedRobots: [],
    schedule: [{ day: "Monday", startTime: "16:00", endTime: "17:30", subject: "Computer Science" }],
    activities: 18,
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "9",
    name: "Classroom I",
    building: "Building C",
    room: "C303",
    capacity: 28,
    currentStudents: 0,
    teacher: {
      id: "9",
      name: "Jennifer Lee",
      email: "jennifer.lee@school.edu",
    },
    assignedRobots: [{ id: "11", name: "Alpha-11", status: "maintenance" }],
    schedule: [],
    activities: 0,
    status: "inactive",
    createdAt: "2024-03-15",
  },
  {
    id: "10",
    name: "Classroom J",
    building: "Building A",
    room: "A104",
    capacity: 26,
    currentStudents: 24,
    teacher: {
      id: "10",
      name: "Michael Anderson",
      email: "michael.anderson@school.edu",
    },
    assignedRobots: [
      { id: "12", name: "Alpha-12", status: "online" },
      { id: "13", name: "Alpha-13", status: "online" },
    ],
    schedule: [
      { day: "Monday", startTime: "12:00", endTime: "13:30", subject: "Literature" },
      { day: "Wednesday", startTime: "12:00", endTime: "13:30", subject: "Writing" },
      { day: "Friday", startTime: "12:00", endTime: "13:30", subject: "Reading" },
    ],
    activities: 52,
    status: "active",
    createdAt: "2024-01-25",
  },
  {
    id: "11",
    name: "Classroom K",
    building: "Building B",
    room: "B204",
    capacity: 20,
    currentStudents: 17,
    teacher: {
      id: "11",
      name: "Susan White",
      email: "susan.white@school.edu",
    },
    assignedRobots: [{ id: "14", name: "Alpha-14", status: "offline" }],
    schedule: [
      { day: "Tuesday", startTime: "09:00", endTime: "10:30", subject: "Spanish" },
      { day: "Thursday", startTime: "09:00", endTime: "10:30", subject: "French" },
    ],
    activities: 29,
    status: "active",
    createdAt: "2024-02-10",
  },
  {
    id: "12",
    name: "Classroom L",
    building: "Building C",
    room: "C304",
    capacity: 32,
    currentStudents: 28,
    teacher: {
      id: "12",
      name: "Daniel Martinez",
      email: "daniel.martinez@school.edu",
    },
    assignedRobots: [
      { id: "15", name: "Alpha-15", status: "online" },
      { id: "16", name: "Alpha-16", status: "online" },
      { id: "17", name: "Alpha-17", status: "maintenance" },
    ],
    schedule: [
      { day: "Monday", startTime: "10:00", endTime: "11:30", subject: "Advanced Mathematics" },
      { day: "Tuesday", startTime: "10:00", endTime: "11:30", subject: "Calculus" },
      { day: "Wednesday", startTime: "10:00", endTime: "11:30", subject: "Statistics" },
      { day: "Thursday", startTime: "10:00", endTime: "11:30", subject: "Algebra" },
      { day: "Friday", startTime: "10:00", endTime: "11:30", subject: "Geometry" },
    ],
    activities: 78,
    status: "active",
    createdAt: "2024-01-05",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAllClassrooms = async (page = 1, perPage = 10): Promise<PagedResult<Classroom>> => {
  await delay(500) // Simulate network delay

  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedData = mockClassrooms.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    total_count: mockClassrooms.length,
    page: page,
    per_page: perPage,
    total_pages: Math.ceil(mockClassrooms.length / perPage),
    has_next: endIndex < mockClassrooms.length,
    has_previous: page > 1,
  }
}

export const getClassroomById = async (id: string): Promise<Classroom> => {
  await delay(300)

  const classroom = mockClassrooms.find((c) => c.id === id)
  if (!classroom) {
    throw new Error(`Classroom with id ${id} not found`)
  }

  return classroom
}

export const createClassroom = async (classroomData: Omit<Classroom, "id" | "createdAt">): Promise<Classroom> => {
  await delay(800)

  const newClassroom: Classroom = {
    id: `${Date.now()}`,
    ...classroomData,
    createdAt: new Date().toISOString().split("T")[0],
  }

  mockClassrooms.push(newClassroom)
  return newClassroom
}

export const updateClassroom = async (
  id: string,
  classroomData: Partial<Omit<Classroom, "id" | "createdAt">>,
): Promise<Classroom> => {
  await delay(600)

  const classroomIndex = mockClassrooms.findIndex((c) => c.id === id)
  if (classroomIndex === -1) {
    throw new Error(`Classroom with id ${id} not found`)
  }

  const updatedClassroom = {
    ...mockClassrooms[classroomIndex],
    ...classroomData,
  }

  mockClassrooms[classroomIndex] = updatedClassroom
  return updatedClassroom
}

export const deleteClassroom = async (id: string): Promise<void> => {
  await delay(400)

  const classroomIndex = mockClassrooms.findIndex((c) => c.id === id)
  if (classroomIndex === -1) {
    throw new Error(`Classroom with id ${id} not found`)
  }

  mockClassrooms.splice(classroomIndex, 1)
}

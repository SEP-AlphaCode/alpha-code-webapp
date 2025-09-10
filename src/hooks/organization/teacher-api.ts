import type { Account } from "@/types/account"
import { PagedResult } from "@/types/page-result"

// Mock teacher data
const mockTeachers: Account[] = [
  {
    id: "teacher-1",
    username: "sarah.johnson",
    fullName: "Sarah Johnson",
    phone: "+1-555-0123",
    email: "sarah.johnson@school.edu",
    gender: 2,
    createdDate: "2024-01-15T08:30:00Z",
    lastEdited: null,
    status: 1,
    image: "/professional-woman-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-2",
    username: "michael.chen",
    fullName: "Michael Chen",
    phone: "+1-555-0124",
    email: "michael.chen@school.edu",
    gender: 1,
    createdDate: "2024-02-20T09:15:00Z",
    lastEdited: "2024-08-28T16:45:00Z",
    status: 1,
    image: "/professional-man-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-3",
    username: "emily.davis",
    fullName: "Emily Davis",
    phone: "+1-555-0125",
    email: "emily.davis@school.edu",
    gender: 2,
    createdDate: "2024-03-10T10:00:00Z",
    lastEdited: null,
    status: 0,
    image: "/professional-woman-teacher.png",
    bannedReason: "Temporary suspension pending review",
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Inactive",
  },
  {
    id: "teacher-4",
    username: "david.wilson",
    fullName: "David Wilson",
    phone: "+1-555-0126",
    email: "david.wilson@school.edu",
    gender: 1,
    createdDate: "2024-01-05T07:45:00Z",
    lastEdited: "2024-09-05T11:30:00Z",
    status: 1,
    image: "/professional-man-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-5",
    username: "lisa.martinez",
    fullName: "Lisa Martinez",
    phone: "+1-555-0127",
    email: "lisa.martinez@school.edu",
    gender: 2,
    createdDate: "2024-04-12T13:20:00Z",
    lastEdited: "2024-09-03T09:15:00Z",
    status: 1,
    image: "/professional-woman-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-1",
    username: "sarah.johnson",
    fullName: "Sarah Johnson",
    phone: "+1-555-0123",
    email: "sarah.johnson@school.edu",
    gender: 2,
    createdDate: "2024-01-15T08:30:00Z",
    lastEdited: "2024-09-01T14:20:00Z",
    status: 1,
    image: "/professional-woman-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-2",
    username: "michael.chen",
    fullName: "Michael Chen",
    phone: "+1-555-0124",
    email: "michael.chen@school.edu",
    gender: 1,
    createdDate: "2024-02-20T09:15:00Z",
    lastEdited: "2024-08-28T16:45:00Z",
    status: 1,
    image: "/professional-man-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-3",
    username: "emily.davis",
    fullName: "Emily Davis",
    phone: "+1-555-0125",
    email: "emily.davis@school.edu",
    gender: 2,
    createdDate: "2024-03-10T10:00:00Z",
    lastEdited: null,
    status: 0,
    image: "/professional-woman-teacher.png",
    bannedReason: "Temporary suspension pending review",
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Inactive",
  },
  {
    id: "teacher-4",
    username: "david.wilson",
    fullName: "David Wilson",
    phone: "+1-555-0126",
    email: "david.wilson@school.edu",
    gender: 1,
    createdDate: "2024-01-05T07:45:00Z",
    lastEdited: "2024-09-05T11:30:00Z",
    status: 1,
    image: "/professional-man-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
  {
    id: "teacher-5",
    username: "lisa.martinez",
    fullName: "Lisa Martinez",
    phone: "+1-555-0127",
    email: "lisa.martinez@school.edu",
    gender: 2,
    createdDate: "2024-04-12T13:20:00Z",
    lastEdited: null,
    status: 1,
    image: "/professional-woman-teacher.png",
    bannedReason: null,
    roleId: "role-teacher",
    roleName: "Teacher",
    statusText: "Active",
  },
]

export const teacherApi = {
  getAllTeachers: async (page = 1, perPage = 10): Promise<PagedResult<Account>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = mockTeachers.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      total_count: mockTeachers.length,
      page,
      per_page: perPage,
      total_pages: Math.ceil(mockTeachers.length / perPage),
      has_next: endIndex < mockTeachers.length,
      has_previous: page > 1,
    }
  },

  getTeacherById: async (id: string): Promise<Account | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockTeachers.find((teacher) => teacher.id === id) || null
  },

  createTeacher: async (teacherData: Partial<Account>): Promise<Account> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newTeacher: Account = {
      id: `teacher-${Date.now()}`,
      username: teacherData.username || "",
      fullName: teacherData.fullName || "",
      phone: teacherData.phone || "",
      email: teacherData.email || "",
      gender: teacherData.gender || 0,
      createdDate: new Date().toISOString(),
      lastEdited: null,
      status: teacherData.status || 1,
      image: teacherData.image || "/professional-teacher.png",
      bannedReason: null,
      roleId: "role-teacher",
      roleName: "Teacher",
      statusText: teacherData.status === 1 ? "Active" : "Inactive",
    }

    mockTeachers.push(newTeacher)
    return newTeacher
  },

  updateTeacher: async (id: string, teacherData: Partial<Account>): Promise<Account> => {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const index = mockTeachers.findIndex((teacher) => teacher.id === id)
    if (index === -1) {
      throw new Error("Teacher not found")
    }

    mockTeachers[index] = {
      ...mockTeachers[index],
      ...teacherData,
      lastEdited: new Date().toISOString(),
      statusText: teacherData.status === 1 ? "Active" : "Inactive",
    }

    return mockTeachers[index]
  },

  deleteTeacher: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const index = mockTeachers.findIndex((teacher) => teacher.id === id)
    if (index === -1) {
      throw new Error("Teacher not found")
    }

    mockTeachers.splice(index, 1)
  },
}

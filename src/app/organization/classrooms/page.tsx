"use client"

import { useState, useEffect } from "react"
import { School, Edit, Trash2, Users, Calendar, BookOpen, User, GraduationCap, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClassDto, ClassStatus, getStatusColor } from "@/types/classEntity"
import { PagedResult } from "@/types/page-result"
//import { type ClassDto, type ClassPagedResult, getStatusColor, ClassStatus } from 

export default function ClassroomManagement() {
  const [classes, setClasses] = useState<ClassDto[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  })

  useEffect(() => {
    // Simulate API call with the provided data structure
    const mockApiResponse: PagedResult<ClassDto> = {
      data: [
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "Mathematics Grade 10",
          createdDate: "2025-09-09T10:05:54.302Z",
          lastUpdate: "2025-09-09T10:05:54.302Z",
          status: 1,
          statusText: "Active",
          teachers: [
            {
              classId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              className: "Mathematics Grade 10",
              createdDate: "2025-09-09T10:05:54.302Z",
              lastUpdate: "2025-09-09T10:05:54.302Z",
              status: 1,
              statusText: "Active",
              teacherId: "teacher-1",
              teacherName: "Sarah Johnson",
            },
          ],
        },
        {
          id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
          name: "English Literature Grade 11",
          createdDate: "2025-09-08T14:30:22.150Z",
          lastUpdate: "2025-09-09T09:15:33.420Z",
          status: 1,
          statusText: "Active",
          teachers: [
            {
              classId: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
              className: "English Literature Grade 11",
              createdDate: "2025-09-08T14:30:22.150Z",
              lastUpdate: "2025-09-09T09:15:33.420Z",
              status: 1,
              statusText: "Active",
              teacherId: "teacher-2",
              teacherName: "Mike Chen",
            },
            {
              classId: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
              className: "English Literature Grade 11",
              createdDate: "2025-09-08T14:30:22.150Z",
              lastUpdate: "2025-09-09T09:15:33.420Z",
              status: 1,
              statusText: "Active",
              teacherId: "teacher-3",
              teacherName: "Emily Davis",
            },
          ],
        },
        {
          id: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
          name: "Physics Grade 12",
          createdDate: "2025-09-07T11:20:15.890Z",
          lastUpdate: "2025-09-07T11:20:15.890Z",
          status: 0,
          statusText: "Inactive",
          teachers: [],
        },
        {
          id: "6fa85f64-5717-4562-b3fc-2c963f66afa9",
          name: "Chemistry Lab",
          createdDate: "2025-09-06T16:45:30.200Z",
          lastUpdate: "2025-09-09T08:30:45.100Z",
          status: 2,
          statusText: "Suspended",
          teachers: [
            {
              classId: "6fa85f64-5717-4562-b3fc-2c963f66afa9",
              className: "Chemistry Lab",
              createdDate: "2025-09-06T16:45:30.200Z",
              lastUpdate: "2025-09-09T08:30:45.100Z",
              status: 2,
              statusText: "Suspended",
              teacherId: "teacher-4",
              teacherName: "Dr. Robert Wilson",
            },
          ],
        },
      ],
      total_count: 4,
      page: 1,
      per_page: 10,
      total_pages: 1,
      has_next: false,
      has_previous: false,
    }

    // Simulate loading delay
    setTimeout(() => {
      setClasses(mockApiResponse.data)
      setPagination({
        page: mockApiResponse.page,
        per_page: mockApiResponse.per_page,
        total_count: mockApiResponse.total_count,
        total_pages: mockApiResponse.total_pages,
        has_next: mockApiResponse.has_next,
        has_previous: mockApiResponse.has_previous,
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeleteClass = (classId: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      console.log("Deleting class:", classId)
      // TODO: Implement API call to delete class
    }
  }

  const handleEditClass = (classId: string) => {
    console.log("Editing class:", classId)
    // TODO: Implement edit functionality
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const stats = {
    total: classes.length,
    active: classes.filter((c) => c.status === ClassStatus.ACTIVE).length,
    inactive: classes.filter((c) => c.status === ClassStatus.INACTIVE).length,
    totalTeachers: classes.reduce((sum, c) => sum + c.teachers.length, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading classes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600">Manage classes and teacher assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Class
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Classes</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <p className="text-sm text-gray-500">ID: {classItem.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <Badge className={getStatusColor(classItem.status)}>{classItem.statusText}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Teachers Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Assigned Teachers</span>
                  </div>
                  {classItem.teachers.length > 0 ? (
                    <div className="space-y-1">
                      {classItem.teachers.map((teacher) => (
                        <div key={teacher.teacherId} className="flex items-center justify-between">
                          <span className="text-sm">{teacher.teacherName}</span>
                          <Badge variant="outline" className={getStatusColor(teacher.status)}>
                            {teacher.statusText}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No teachers assigned</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium">{formatDate(classItem.createdDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(classItem.lastUpdate)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditClass(classItem.id)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Users className="h-3 w-3 mr-1" />
                    Teachers
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteClass(classItem.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.per_page + 1} to{" "}
            {Math.min(pagination.page * pagination.per_page, pagination.total_count)} of {pagination.total_count}{" "}
            classes
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled={!pagination.has_previous}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!pagination.has_next}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

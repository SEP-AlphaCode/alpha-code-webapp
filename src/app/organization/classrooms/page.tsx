"use client"

import { useState } from "react"
import { School, Edit, Trash2, Users, Calendar, BookOpen, User, GraduationCap, Plus, Award, Clock, MapPin, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import dayjs from "dayjs"
import { ClassDto, Classroom, ClassStatus, getStatusColor } from "@/types/class-entity"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useClassroom } from "@/hooks/organization/use-class"

export default function ClassroomManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)

  const classroomHooks = useClassroom()
  const { data: classroomsResponse, isLoading, error } = classroomHooks.useGetAllClassrooms(currentPage, perPage)
  const deleteClassroomMutation = classroomHooks.useDeleteClassroom()
  const updateClassroomMutation = classroomHooks.useUpdateClassroom()

  const classrooms = classroomsResponse?.data || []
  const pagination = classroomsResponse
    ? classroomsResponse
    : {
      page: 1,
      per_page: 10,
      total_count: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    }

  const handleDeleteClassroom = (classroomId: string) => {
    const classroomToDelete = classrooms.find((c) => c.id === classroomId)
    const classroomName = classroomToDelete?.name || "this classroom"

    const confirmDelete = () => (
      <div className="flex flex-col space-y-3">
        <div className="text-sm text-gray-700">
          Are you sure you want to delete <strong>{classroomName}</strong>?
        </div>
        <div className="text-xs text-gray-500">This action cannot be undone.</div>
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={deleteClassroomMutation.isPending}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deleteClassroomMutation.mutate(classroomId, {
                onSuccess: () => {
                  toast.success(`Classroom "${classroomName}" deleted successfully!`)
                },
                onError: (error) => {
                  console.error("❌ Error deleting classroom:", error)
                  const errorMessage = error instanceof Error ? error.message : "Failed to delete classroom"
                  toast.error(`Error: ${errorMessage}`)
                },
              })
              toast.dismiss()
            }}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={deleteClassroomMutation.isPending}
          >
            {deleteClassroomMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    )

    toast.warning(confirmDelete)
  }

  const handleEditClassroom = (classroomData: Classroom) => {
    console.log("Editing classroom:", classroomData)
    // TODO: Implement edit functionality with full classroom data
  }

  const handlePreviousPage = () => {
    if (pagination.has_previous) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.has_next) {
      setCurrentPage(currentPage + 1)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return dayjs(dateString).format("MMM D, YYYY")
  }

  const stats = {
    total: pagination.total_count,
    active: classrooms.filter((c) => c.status === "active").length,
    inactive: classrooms.filter((c) => c.status === "inactive").length,
    maintenance: classrooms.filter((c) => c.status === "maintenance").length,
    totalStudents: classrooms.reduce((sum, c) => sum + c.currentStudents, 0),
    totalCapacity: classrooms.reduce((sum, c) => sum + c.capacity, 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStudentAvatar = (name: string, index: number) => {
    const colors = [
      "bg-red-100 text-red-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-yellow-100 text-yellow-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
      "bg-orange-100 text-orange-600",
    ]
    return {
      initials: name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      color: colors[index % colors.length],
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading classrooms...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading classrooms: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
          <p className="text-gray-600">Manage classrooms, students, and robot assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Classroom
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classrooms</p>
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
                <p className="text-sm font-medium text-gray-600">Active</p>
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
                <p className="text-sm font-medium text-gray-600">Inactive</p>
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
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capacity</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalCapacity}</p>
              </div>
              <Bot className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classrooms Grid - Updated to match student dashboard style */}
      <div className="space-y-4">
        {classrooms.map((classroom, index) => {
          const avatar = getStudentAvatar(classroom.name, index)
          return (
            <Card key={classroom.id} className="hover:shadow-lg transition-shadow -py-3">
              <CardContent className="p-3 bg-white rounded-2xl">
                <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm ${avatar.color}`}>{avatar.initials}</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{classroom.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{classroom.building} • {classroom.room}</span>
                        <Badge className={getStatusColor(classroom.status)}>{classroom.status.charAt(0).toUpperCase() + classroom.status.slice(1)}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">Teacher: {classroom.teacher.name}</div>
                    </div>
                  </div>
                </div>
                {/* Stats & Progress Row + Robot Status/Schedule justified */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6 lg:gap-60">
                  {/* Left: Stats & Progress */}
                  <div className="flex flex-row flex-wrap gap-6 sm:gap-12 items-center py-1 w-full lg:w-auto">

                    {/* Occupancy */}
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className="font-semibold text-xs text-gray-700">Students</span>
                      <span className="text-blue-600 text-sm">{classroom.currentStudents}/{classroom.capacity}</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(classroom.currentStudents / classroom.capacity) * 100}%` }} />
                      </div>
                    </div>
                    {/* Activity Progress */}
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className="font-semibold text-xs text-gray-700">Activity completed</span>
                      <span className="text-green-600 text-sm">{classroom.activities}</span>
                      {/* <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: `${Math.min((classroom.activities / 50) * 100, 100)}%` }} />
                        </div> */}
                    </div>
                    {/* Robots */}
                    <div className="flex flex-col items-center min-w-[60px]">
                      <Bot className="h-5 w-5 text-green-500 mb-1" />
                      <span className="text-sm font-semibold">{classroom.assignedRobots.length}</span>
                      <span className="text-xs text-gray-500">Robots</span>
                    </div>
                    {/* Sessions */}
                    <div className="flex flex-col items-center min-w-[60px]">
                      <Calendar className="h-5 w-5 text-purple-500 mb-1" />
                      <span className="text-sm font-semibold">{classroom.schedule.length}</span>
                      <span className="text-xs text-gray-500">Sessions</span>
                    </div>
                  </div>
                  {/* Weekly Calendar Grid aligned right, visually emphasized with more padding */}
                  <div className="w-full lg:flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] border border-gray-200 rounded text-xs">
                        <thead>
                          <tr className="bg-blue-100">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                              <th key={day} className="px-6 py-3 font-medium text-blue-900 border-b border-blue-200">{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                              const sessions = classroom.schedule.filter(s => s.day === day)
                              return (
                                <td key={day} className="text-center align-top px-3 py-3 border-b border-blue-100 min-w-[80px]">
                                  {sessions.length > 0 ? (
                                    sessions.map((session, idx) => (
                                      <div key={idx} className="mb-5">
                                        <span className="block text-blue-900 font-semibold">{session.startTime} - {session.endTime}</span>
                                        <span className="block text-blue-700">{session.subject}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-blue-200">-</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="grid grid-cols-2 sm:flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditClassroom(classroom)} className="flex-1">
                    <Edit className="h-3 w-3 mr-2" />Edit Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Users className="h-3 w-3 mr-2" />View Students
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Calendar className="h-3 w-3 mr-2" />Schedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteClassroom(classroom.id)} disabled={deleteClassroomMutation.isPending} className="px-3">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.per_page + 1} to{" "}
            {Math.min(pagination.page * pagination.per_page, pagination.total_count)} of {pagination.total_count}{" "}
            classrooms
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled={!pagination.has_previous} onClick={handlePreviousPage}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!pagination.has_next} onClick={handleNextPage}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

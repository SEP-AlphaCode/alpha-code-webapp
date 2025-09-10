"use client"

import { useState } from "react"
import { School, Edit, Trash2, Users, Calendar, BookOpen, User, GraduationCap, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useClass } from "@/hooks/organization/use-class"
import { ClassStatus, getStatusColor } from "@/types/class-entity"

export default function ClassroomManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(12)

  const classHooks = useClass()
  const { data: classesResponse, isLoading, error } = classHooks.useGetAllClasses(currentPage, perPage)
  const deleteClassMutation = classHooks.useDeleteClass()
  const updateClassMutation = classHooks.useUpdateClass()

  // Extract classes and pagination from response
  const classes = classesResponse?.data || []
  const pagination = classesResponse
    ? {
        page: classesResponse.page,
        per_page: classesResponse.per_page,
        total_count: classesResponse.total_count,
        total_pages: classesResponse.total_pages,
        has_next: classesResponse.has_next,
        has_previous: classesResponse.has_previous,
      }
    : {
        page: 1,
        per_page: 10,
        total_count: 0,
        total_pages: 0,
        has_next: false,
        has_previous: false,
      }

  const handleDeleteClass = (classId: string) => {
    const classToDelete = classes.find((c) => c.id === classId)
    const className = classToDelete?.name || "this class"

    const confirmDelete = () => (
      <div className="flex flex-col space-y-3">
        <div className="text-sm text-gray-700">
          Are you sure you want to delete <strong>{className}</strong>?
        </div>
        <div className="text-xs text-gray-500">This action cannot be undone.</div>
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={deleteClassMutation.isPending}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deleteClassMutation.mutate(classId, {
                onSuccess: () => {
                  toast.success(`Class "${className}" deleted successfully!`)
                },
                onError: (error) => {
                  console.error("❌ Error deleting class:", error)
                  const errorMessage = error instanceof Error ? error.message : "Failed to delete class"
                  toast.error(`Error: ${errorMessage}`)
                },
              })
              toast.dismiss()
            }}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={deleteClassMutation.isPending}
          >
            {deleteClassMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    )

    toast.warning(confirmDelete)
  }

  const handleEditClass = (classId: string) => {
    console.log("Editing class:", classId)
    // TODO: Implement edit functionality
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading classes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading classes: {error.message}</div>
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
                          <span className="text-sm">{teacher.teacherName || "Unknown Teacher"}</span>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClass(classItem.id)}
                    disabled={deleteClassMutation.isPending}
                  >
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

"use client"

import { useState, useMemo } from "react"
import { useTeacher } from "@/hooks/organization/use-teacher"
import type { Account } from "@/types/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Users,
    UserCheck,
    UserX,
    GraduationCap,
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import dayjs from "dayjs"

interface TeacherManagementProps {
    className?: string
}

export default function TeacherManagement({ className }: TeacherManagementProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const perPage = 12

    const teacherHooks = useTeacher()
    const { data: teachersResponse, isLoading, error } = teacherHooks.useGetAllTeachers(currentPage, perPage)
    const deleteTeacherMutation = teacherHooks.useDeleteTeacher()
    const updateTeacherMutation = teacherHooks.useUpdateTeacher()

    const teachers = teachersResponse?.data || []
    const totalPages = teachersResponse?.total_pages || 1
    const totalCount = teachersResponse?.total_count || 0

    // Filter teachers based on search and status
    const filteredTeachers = useMemo(() => {
        return teachers.filter((teacher) => {
            const matchesSearch =
                teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.username.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && teacher.status === 1) ||
                (statusFilter === "inactive" && teacher.status === 0)
            return matchesSearch && matchesStatus
        })
    }, [teachers, searchTerm, statusFilter])

    // Statistics
    const stats = useMemo(() => {
        const active = teachers.filter((t) => t.status === 1).length
        const inactive = teachers.filter((t) => t.status === 0).length
        const male = teachers.filter((t) => t.gender === 1).length
        const female = teachers.filter((t) => t.gender === 2).length

        return {
            total: teachers.length,
            active,
            inactive,
            male,
            female,
        }
    }, [teachers])

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never"
        return dayjs(dateString).format("DD/MM/YYYY")
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const handleDeleteTeacher = (teacher: Account) => {
        const confirmDelete = () => (
            <div className="flex flex-col space-y-3">
                <div className="text-sm text-gray-700">
                    Are you sure you want to delete <strong>{teacher.fullName}</strong>?
                </div>
                <div className="text-xs text-gray-500">This action cannot be undone.</div>
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            deleteTeacherMutation.mutate(teacher.id, {
                                onSuccess: () => {
                                    toast.success(`Teacher "${teacher.fullName}" deleted successfully!`)
                                },
                                onError: (error) => {
                                    toast.error(`Error: ${error.message}`)
                                },
                            })
                            toast.dismiss()
                        }}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        )

        toast.warning(confirmDelete)
    }

    const handleToggleStatus = (teacher: Account) => {
        const newStatus = teacher.status === 1 ? 0 : 1
        const statusText = newStatus === 1 ? "activated" : "deactivated"

        updateTeacherMutation.mutate(
            {
                id: teacher.id,
                teacherData: { status: newStatus },
            },
            {
                onSuccess: () => {
                    toast.success(`${teacher.fullName} has been ${statusText} successfully!`)
                },
                onError: (error) => {
                    toast.error(`Error: ${error.message}`)
                },
            },
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error loading teachers: {error.message}</p>
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
                    <p className="text-gray-600">Manage teacher accounts and permissions</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Teachers</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Teachers</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Inactive Teachers</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by name, email, or username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeachers.map((teacher) => (
                    <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={teacher.image || "/placeholder.svg"} alt={teacher.fullName} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {getInitials(teacher.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{teacher.fullName}</CardTitle>
                                        <CardDescription>@{teacher.username}</CardDescription>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleToggleStatus(teacher)}>
                                            {teacher.status === 1 ? "Deactivate" : "Activate"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteTeacher(teacher)} className="text-red-600">
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant={teacher.status === 1 ? "default" : "secondary"}
                                    className={teacher.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                >
                                    {teacher.statusText}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {teacher.gender === 1 ? "Male" : teacher.gender === 2 ? "Female" : "Other"}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{teacher.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{teacher.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>Joined {formatDate(teacher.createdDate)}</span>
                                </div>
                            </div>

                            {teacher.bannedReason && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                    <strong>Banned:</strong> {teacher.bannedReason}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount}{" "}
                        teachers
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

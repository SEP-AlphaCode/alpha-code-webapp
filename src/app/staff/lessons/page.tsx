"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Play,
  Code,
  CheckCircle2,
  BookOpen,
  Layers,
  LucideIcon,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAllLessons, useDeleteLesson } from "@/features/courses/hooks/use-lesson"
import { useStaffCourses } from "@/features/courses/hooks"
import { toast } from "sonner"

const lessonTypeMap: { [key: number]: { text: string; icon: LucideIcon; color: string } } = {
  1: { text: "Bài học", icon: Code, color: "bg-green-500/10 text-green-500" },
  2: { text: "Video", icon: Play, color: "bg-blue-500/10 text-blue-500" },
  3: { text: "Kiểm tra", icon: CheckCircle2, color: "bg-purple-500/10 text-purple-500" }
}

export default function AllLessonsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 20

  // Fetch all lessons with pagination
  const { data: lessonsData, isLoading: lessonsLoading } = useAllLessons({
    page: currentPage,
    size: pageSize,
    search: searchQuery || undefined
  })

  const lessons = lessonsData?.data || []
  const deleteLessonMutation = useDeleteLesson('')

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài học "${lessonTitle}"?`)) {
      try {
        await deleteLessonMutation.mutateAsync(lessonId)
        toast.success('Đã xóa bài học')
      } catch (error) {
        toast.error('Lỗi khi xóa bài học')
        console.error('Error deleting lesson:', error)
      }
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    const matchesType = selectedType === "all" || lesson.type.toString() === selectedType
    return matchesType
  })

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Bài học</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả các bài học trong hệ thống
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng bài học
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả các bài học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bài Video
            </CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter(l => l.type === 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Bài học dạng video
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bài Lập trình
            </CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter(l => l.type === 2).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Bài tập lập trình
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cần Robot
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter(l => l.requireRobot).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Bài yêu cầu robot
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài học</CardTitle>
          <CardDescription>
            {filteredLessons.length} bài học được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Loại bài học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="1">Bài học</SelectItem>
                <SelectItem value="2">Video</SelectItem>
                <SelectItem value="3">Kiểm tra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên bài học</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Robot</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy bài học nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLessons.map((lesson) => {
                    const typeInfo = lessonTypeMap[lesson.type]
                    const TypeIcon = typeInfo.icon
                    
                    return (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="flex items-start gap-2">
                            <TypeIcon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {lesson.content}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            <TypeIcon className="mr-1 h-3 w-3" />
                            {typeInfo.text}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(lesson.duration)}</TableCell>
                        <TableCell>
                          {lesson.requireRobot ? (
                            <Badge variant="secondary">Có</Badge>
                          ) : (
                            <Badge variant="outline">Không</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => router.push(`/staff/lessons/${lesson.slug}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => router.push(`/staff/lessons/${lesson.slug}/edit`)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

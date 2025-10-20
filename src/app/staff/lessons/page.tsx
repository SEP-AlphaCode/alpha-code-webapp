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
  Layers
} from "lucide-react"
import Link from "next/link"

// Mock data
const mockCourses = [
  { id: "c1", name: "Python cho người mới bắt đầu" },
  { id: "c2", name: "JavaScript Fundamentals" },
  { id: "c3", name: "Điều khiển Robot Alpha" }
]

const mockSections = [
  { id: "s1", courseId: "c1", courseName: "Python cho người mới bắt đầu", title: "Giới thiệu về Python" },
  { id: "s2", courseId: "c1", courseName: "Python cho người mới bắt đầu", title: "Cấu trúc dữ liệu cơ bản" },
  { id: "s3", courseId: "c2", courseName: "JavaScript Fundamentals", title: "JavaScript Basics" },
  { id: "s4", courseId: "c3", courseName: "Điều khiển Robot Alpha", title: "Lập trình Robot" }
]

const mockLessons = [
  {
    id: "l1",
    sectionId: "s1",
    sectionTitle: "Giới thiệu về Python",
    courseId: "c1",
    courseName: "Python cho người mới bắt đầu",
    title: "Python là gì?",
    content: "Giới thiệu về ngôn ngữ lập trình Python",
    videoUrl: "https://example.com/video1.mp4",
    duration: 600,
    requireRobot: false,
    type: 1,
    orderNumber: 1,
    createdDate: "2024-02-01"
  },
  {
    id: "l2",
    sectionId: "s1",
    sectionTitle: "Giới thiệu về Python",
    courseId: "c1",
    courseName: "Python cho người mới bắt đầu",
    title: "Cài đặt môi trường Python",
    content: "Hướng dẫn cài đặt Python và IDE",
    videoUrl: "https://example.com/video2.mp4",
    duration: 900,
    requireRobot: false,
    type: 1,
    orderNumber: 2,
    createdDate: "2024-02-01"
  },
  {
    id: "l3",
    sectionId: "s1",
    sectionTitle: "Giới thiệu về Python",
    courseId: "c1",
    courseName: "Python cho người mới bắt đầu",
    title: "Viết chương trình Python đầu tiên",
    content: "Thực hành viết Hello World",
    videoUrl: null,
    duration: 1200,
    requireRobot: false,
    type: 2,
    orderNumber: 3,
    createdDate: "2024-02-02"
  },
  {
    id: "l4",
    sectionId: "s2",
    sectionTitle: "Cấu trúc dữ liệu cơ bản",
    courseId: "c1",
    courseName: "Python cho người mới bắt đầu",
    title: "List và Tuple",
    content: "Tìm hiểu về List và Tuple trong Python",
    videoUrl: "https://example.com/video4.mp4",
    duration: 1800,
    requireRobot: false,
    type: 1,
    orderNumber: 1,
    createdDate: "2024-02-03"
  },
  {
    id: "l5",
    sectionId: "s2",
    sectionTitle: "Cấu trúc dữ liệu cơ bản",
    courseId: "c1",
    courseName: "Python cho người mới bắt đầu",
    title: "Bài kiểm tra: Cấu trúc dữ liệu",
    content: "Kiểm tra kiến thức về cấu trúc dữ liệu",
    videoUrl: null,
    duration: 600,
    requireRobot: false,
    type: 3,
    orderNumber: 2,
    createdDate: "2024-02-04"
  },
  {
    id: "l6",
    sectionId: "s3",
    sectionTitle: "JavaScript Basics",
    courseId: "c2",
    courseName: "JavaScript Fundamentals",
    title: "Variables và Data Types",
    content: "Biến và kiểu dữ liệu trong JavaScript",
    videoUrl: "https://example.com/video6.mp4",
    duration: 1500,
    requireRobot: false,
    type: 1,
    orderNumber: 1,
    createdDate: "2024-02-05"
  },
  {
    id: "l7",
    sectionId: "s4",
    sectionTitle: "Lập trình Robot",
    courseId: "c3",
    courseName: "Điều khiển Robot Alpha",
    title: "Thực hành với Robot Alpha",
    content: "Lập trình điều khiển robot",
    videoUrl: null,
    duration: 1500,
    requireRobot: true,
    type: 2,
    orderNumber: 1,
    createdDate: "2024-02-06"
  }
]

const lessonTypeMap: { [key: number]: { text: string; icon: any; color: string } } = {
  1: { text: "Video", icon: Play, color: "bg-blue-500/10 text-blue-500" },
  2: { text: "Lập trình", icon: Code, color: "bg-green-500/10 text-green-500" },
  3: { text: "Kiểm tra", icon: CheckCircle2, color: "bg-purple-500/10 text-purple-500" }
}

export default function AllLessonsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [lessons] = useState(mockLessons)
  const [courses] = useState(mockCourses)

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = selectedCourse === "all" || lesson.courseId === selectedCourse
    const matchesType = selectedType === "all" || lesson.type.toString() === selectedType
    
    return matchesSearch && matchesCourse && matchesType
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
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Lọc theo khóa học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa học</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Loại bài học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="1">Video</SelectItem>
                <SelectItem value="2">Lập trình</SelectItem>
                <SelectItem value="3">Kiểm tra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên bài học</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Chương</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Robot</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                          <Badge variant="outline" className="whitespace-nowrap">
                            {lesson.courseName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Layers className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">
                              {lesson.sectionTitle}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
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
                        <TableCell>
                          {new Date(lesson.createdDate).toLocaleDateString('vi-VN')}
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
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${lesson.courseId}/sections/${lesson.sectionId}/lessons/${lesson.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${lesson.courseId}/sections/${lesson.sectionId}/lessons/${lesson.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${lesson.courseId}/sections/${lesson.sectionId}/lessons`}>
                                  <Layers className="mr-2 h-4 w-4" />
                                  Xem chương
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
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

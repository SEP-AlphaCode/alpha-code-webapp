"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  GripVertical,
  MoveUp,
  MoveDown,
  Play,
  Code,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

// Mock data
const mockCourse = {
  id: "c1",
  name: "Python cho người mới bắt đầu",
}

const mockSection = {
  id: "s1",
  courseId: "c1",
  title: "Giới thiệu về Python",
  orderNumber: 1,
}

const mockLessons = [
  {
    id: "l1",
    sectionId: "s1",
    title: "Python là gì?",
    content: "Giới thiệu về ngôn ngữ lập trình Python",
    videoUrl: "https://example.com/video1.mp4",
    duration: 600, // 10 minutes
    requireRobot: false,
    type: 1, // 1: video, 2: coding, 3: quiz
    orderNumber: 1,
    createdDate: "2024-02-01"
  },
  {
    id: "l2",
    sectionId: "s1",
    title: "Cài đặt môi trường Python",
    content: "Hướng dẫn cài đặt Python và IDE",
    videoUrl: "https://example.com/video2.mp4",
    duration: 900, // 15 minutes
    requireRobot: false,
    type: 1,
    orderNumber: 2,
    createdDate: "2024-02-01"
  },
  {
    id: "l3",
    sectionId: "s1",
    title: "Viết chương trình Python đầu tiên",
    content: "Thực hành viết Hello World",
    videoUrl: null,
    duration: 1200, // 20 minutes
    requireRobot: false,
    type: 2,
    orderNumber: 3,
    createdDate: "2024-02-02"
  },
  {
    id: "l4",
    sectionId: "s1",
    title: "Biến và kiểu dữ liệu",
    content: "Tìm hiểu về biến và các kiểu dữ liệu cơ bản",
    videoUrl: "https://example.com/video4.mp4",
    duration: 1800, // 30 minutes
    requireRobot: false,
    type: 1,
    orderNumber: 4,
    createdDate: "2024-02-03"
  },
  {
    id: "l5",
    sectionId: "s1",
    title: "Bài kiểm tra: Kiến thức cơ bản",
    content: "Kiểm tra kiến thức đã học",
    videoUrl: null,
    duration: 600, // 10 minutes
    requireRobot: false,
    type: 3,
    orderNumber: 5,
    createdDate: "2024-02-04"
  },
  {
    id: "l6",
    sectionId: "s1",
    title: "Thực hành với Robot Alpha",
    content: "Lập trình điều khiển robot",
    videoUrl: null,
    duration: 1500, // 25 minutes
    requireRobot: true,
    type: 2,
    orderNumber: 6,
    createdDate: "2024-02-05"
  }
]

const lessonTypeMap: { [key: number]: { text: string; icon: any; color: string } } = {
  1: { text: "Video", icon: Play, color: "bg-blue-500/10 text-blue-500" },
  2: { text: "Lập trình", icon: Code, color: "bg-green-500/10 text-green-500" },
  3: { text: "Kiểm tra", icon: CheckCircle2, color: "bg-purple-500/10 text-purple-500" }
}

export default function SectionLessonsPage() {
  const params = useParams()
  const courseId = params.id as string
  const sectionId = params.sectionId as string
  const [course] = useState(mockCourse)
  const [section] = useState(mockSection)
  const [lessons, setLessons] = useState(mockLessons)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const moveLesson = (index: number, direction: 'up' | 'down') => {
    const newLessons = [...lessons]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newLessons.length) return
    
    // Swap lessons
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]]
    
    // Update order numbers
    newLessons[index].orderNumber = index + 1
    newLessons[targetIndex].orderNumber = targetIndex + 1
    
    setLessons(newLessons)
    
    // TODO: Call API to update order
    console.log('Reordering lessons:', newLessons.map(l => l.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/staff/courses/${courseId}/sections`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{course.name}</span>
            <span>/</span>
            <span>Chương {section.orderNumber}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
          <p className="text-muted-foreground">
            Quản lý các bài học trong chương
          </p>
        </div>
        <Link href={`/staff/courses/${courseId}/sections/${sectionId}/lessons/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài học mới
          </Button>
        </Link>
      </div>

      {/* Section Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chương</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng số bài học</p>
              <p className="font-medium">{lessons.length} bài</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bài có video</p>
              <p className="font-medium">
                {lessons.filter(l => l.type === 1).length} bài
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bài lập trình</p>
              <p className="font-medium">
                {lessons.filter(l => l.type === 2).length} bài
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bài yêu cầu Robot</p>
              <p className="font-medium">
                {lessons.filter(l => l.requireRobot).length} bài
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài học</CardTitle>
          <CardDescription>
            {lessons.length} bài học trong chương này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Tên bài học</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Robot</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chưa có bài học nào. Hãy tạo bài học đầu tiên!
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson, index) => {
                    const typeInfo = lessonTypeMap[lesson.type]
                    const TypeIcon = typeInfo.icon
                    
                    return (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <span className="font-medium">{lesson.orderNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-md">
                          <div className="flex items-start gap-2">
                            <TypeIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p>{lesson.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {lesson.content}
                              </p>
                            </div>
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
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveLesson(index, 'up')}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveLesson(index, 'down')}
                              disabled={index === lessons.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
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
                                  <Link href={`/staff/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/staff/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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

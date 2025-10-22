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
  CheckCircle2,
  LucideIcon,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useStaffCourse } from "@/features/courses/hooks/use-course"
import { useLessonsBySection, useDeleteLesson, useUpdateLessonOrder } from "@/features/courses/hooks/use-lesson"
import { useSection } from "@/features/courses/hooks/use-section"
import { toast } from "sonner"
import { Lesson } from "@/types/courses"
import { DeleteLessonDialog } from "@/components/course/delete-lesson-dialog"

const lessonTypeMap: { [key: number]: { text: string; icon: LucideIcon; color: string } } = {
  1: { text: "Bài học", icon: Code, color: "bg-green-500/10 text-green-500" },
  2: { text: "Video", icon: Play, color: "bg-blue-500/10 text-blue-500" },
  3: { text: "Kiểm tra", icon: CheckCircle2, color: "bg-purple-500/10 text-purple-500" }
}

export default function SectionLessonsPage() {
  const params = useParams()
  const courseSlug = params.slug as string
  const sectionId = params.sectionId as string
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null)
  const [deletingLessonName, setDeletingLessonName] = useState("")
  
  const { data: course, isLoading: courseLoading } = useStaffCourse(courseSlug)
  const courseId = course?.id ?? ''
  
  const { data: section, isLoading: sectionLoading } = useSection(courseId, sectionId)
  const { data: lessons = [], isLoading: lessonsLoading } = useLessonsBySection(courseId, sectionId)
  const deleteLessonMutation = useDeleteLesson(courseId, sectionId)
  const updateLessonOrderMutation = useUpdateLessonOrder(courseId, sectionId)
  
  const isLoading = courseLoading || sectionLoading || lessonsLoading

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const moveLesson = async (index: number, direction: 'up' | 'down') => {
    const newLessons = [...lessons]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newLessons.length) return
    
    // Swap lessons
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]]
    
    // Update order numbers
    newLessons[index].orderNumber = index + 1
    newLessons[targetIndex].orderNumber = targetIndex + 1
    
    try {
      await updateLessonOrderMutation.mutateAsync(
        newLessons.map(l => ({
          id: l.id,
          orderNumber: l.orderNumber,
          sectionId: sectionId
        }))
      )
      toast.success('Đã cập nhật thứ tự bài học')
    } catch (error) {
      toast.error('Lỗi khi cập nhật thứ tự bài học')
      console.error('Error updating lesson order:', error)
    }
  }

  const handleDeleteLesson = (lessonId: string, lessonName: string) => {
    setDeletingLessonId(lessonId)
    setDeletingLessonName(lessonName)
  }

  const handleDeleteLessonConfirm = async () => {
    if (!deletingLessonId) return
    
    try {
      await deleteLessonMutation.mutateAsync(deletingLessonId)
      setDeletingLessonId(null)
      setDeletingLessonName("")
      toast.success('Đã xóa bài học thành công')
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lỗi khi xóa bài học'
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Lỗi khi xóa bài học'
      toast.error(errorMessage)
      console.error('Error deleting lesson:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/staff/courses/${courseSlug}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{course?.name}</span>
            <span>/</span>
            <span>Chương {section?.orderNumber}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{section?.title}</h1>
          <p className="text-muted-foreground">
            Quản lý các bài học trong chương
          </p>
        </div>
        <Link href={`/staff/courses/${courseSlug}/sections/${sectionId}/lessons/new`}>
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
                  <TableHead className="text-right w-[200px]">Thao tác</TableHead>
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
                                  <Link href={`/staff/lessons/${lesson.slug}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/staff/lessons/${lesson.slug}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                  </Link>
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

      <DeleteLessonDialog
        open={!!deletingLessonId}
        lessonTitle={deletingLessonName}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingLessonId(null)
            setDeletingLessonName("")
          }
        }}
        onConfirm={handleDeleteLessonConfirm}
        isDeleting={deleteLessonMutation.isPending}
      />
    </div>
  )
}

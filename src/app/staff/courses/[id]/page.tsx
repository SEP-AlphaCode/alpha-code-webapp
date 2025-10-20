"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  Play,
  Code,
  CheckCircle2,
  Loader2,
  FileText,
  Layers
} from "lucide-react"
import Link from "next/link"
import { Section, Lesson } from "@/types/courses"
import { useStaffCourse, useSections, useUpdateSectionOrder, useDeleteSection, useDeleteLesson } from "@/features/courses/hooks"
import * as lessonApi from "@/features/courses/api/lesson-api"
import { toast } from "sonner"
import { UUID } from "crypto"
import { CreateSectionModal } from "@/components/course/create-section-modal"
import { EditSectionModal } from "@/components/course/edit-section-modal"
import { DeleteSectionDialog } from "@/components/course/delete-section-dialog"
import { DeleteLessonDialog } from "@/components/course/delete-lesson-dialog"
import { LucideIcon } from "lucide-react"

const lessonTypeMap: { [key: number]: { text: string; icon: LucideIcon; color: string } } = {
  1: { text: "Bài học", icon: Code, color: "bg-green-500/10 text-green-500" },
  2: { text: "Video", icon: Play, color: "bg-blue-500/10 text-blue-500" },
  3: { text: "Kiểm tra", icon: CheckCircle2, color: "bg-purple-500/10 text-purple-500" }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.slug as string
  
  const { data: course, isLoading: courseLoading } = useStaffCourse(courseSlug)
  const courseId = course?.id ?? '' // Get actual ID from course data for API calls
  
  const { data: sections, isLoading: sectionsLoading, refetch: refetchSections } = useSections(courseId || '')
  const updateSectionOrderMutation = useUpdateSectionOrder(courseId || '')
  const deleteSectionMutation = useDeleteSection(courseId || '')
  const deleteLessonMutation = useDeleteLesson(courseId || '')

  const [sectionsData, setSectionsData] = useState<Section[]>([])
  const [draggedLesson, setDraggedLesson] = useState<{ lesson: Lesson; sectionId: string } | null>(null)
  const [draggedSection, setDraggedSection] = useState<number | null>(null)
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState("")
  const [editingSectionOrderNumber, setEditingSectionOrderNumber] = useState(0)
  const [deletingSectionId, setDeleteSectionId] = useState<string | null>(null)
  const [deletingSectionTitle, setDeleteSectionTitle] = useState("")
  const [deletingLessonId, setDeleteLessonId] = useState<string | null>(null)
  const [deletingLessonTitle, setDeleteLessonTitle] = useState("")

  // Update local state when sections data changes
  useEffect(() => {
    if (sections && Array.isArray(sections)) {
      setSectionsData(sections)
    }
  }, [sections])

  const isLoading = courseLoading || sectionsLoading

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleDragStart = (lesson: Lesson, sectionId: string) => {
    setDraggedLesson({ lesson, sectionId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetSectionId: string, targetIndex: number) => {
    if (!draggedLesson || !Array.isArray(sectionsData)) return

    const newSectionsData = [...sectionsData]
    const sourceSectionIndex = newSectionsData.findIndex(
      s => s.id === draggedLesson.sectionId
    )
    const targetSectionIndex = newSectionsData.findIndex(
      s => s.id === targetSectionId
    )

    if (sourceSectionIndex === -1 || targetSectionIndex === -1) return

    // Remove lesson from source
    const sourceLessons = [...(newSectionsData[sourceSectionIndex].lessons || [])]
    const lessonIndex = sourceLessons.findIndex(l => l.id === draggedLesson.lesson.id)
    const [movedLesson] = sourceLessons.splice(lessonIndex, 1)

    // Update order numbers in source section
    sourceLessons.forEach((lesson, idx) => {
      lesson.orderNumber = idx + 1
    })

    newSectionsData[sourceSectionIndex] = {
      ...newSectionsData[sourceSectionIndex],
      lessons: sourceLessons
    }

    // Add lesson to target
    const targetLessons = sourceSectionIndex === targetSectionIndex 
      ? sourceLessons 
      : [...(newSectionsData[targetSectionIndex].lessons || [])]
    
    movedLesson.sectionId = targetSectionId
    targetLessons.splice(targetIndex, 0, movedLesson)

    // Update order numbers in target section
    targetLessons.forEach((lesson, idx) => {
      lesson.orderNumber = idx + 1
    })

    newSectionsData[targetSectionIndex] = {
      ...newSectionsData[targetSectionIndex],
      lessons: targetLessons
    }

    setSectionsData(newSectionsData)
    setDraggedLesson(null)

    // Call API to update lesson order
    try {
      await lessonApi.updateLessonOrder(
        targetSectionId,
        targetLessons.map(l => ({
          id: l.id,
          orderNumber: l.orderNumber,
          sectionId: targetSectionId
        }))
      )
      
      // If moving between sections, also update source section
      if (sourceSectionIndex !== targetSectionIndex) {
        await lessonApi.updateLessonOrder(
          draggedLesson.sectionId,
          sourceLessons.map(l => ({
            id: l.id,
            orderNumber: l.orderNumber,
            sectionId: draggedLesson.sectionId
          }))
        )
      }
      
      toast.success('Đã cập nhật thứ tự bài học')
      refetchSections()
    } catch (error) {
      toast.error('Lỗi khi cập nhật thứ tự bài học')
      console.error('Error updating lesson order:', error)
    }
  }

  const moveSectionUp = async (index: number) => {
    if (index === 0 || !Array.isArray(sectionsData)) return
    const newSectionsData = [...sectionsData]
    const temp = newSectionsData[index]
    newSectionsData[index] = newSectionsData[index - 1]
    newSectionsData[index - 1] = temp
    
    // Update order numbers
    newSectionsData[index].orderNumber = index + 1
    newSectionsData[index - 1].orderNumber = index
    
    setSectionsData(newSectionsData)
    
    // Call API to update section order
    await updateSectionOrder(newSectionsData)
  }

  const moveSectionDown = async (index: number) => {
    if (!Array.isArray(sectionsData) || index === sectionsData.length - 1) return
    const newSectionsData = [...sectionsData]
    const temp = newSectionsData[index]
    newSectionsData[index] = newSectionsData[index + 1]
    newSectionsData[index + 1] = temp
    
    // Update order numbers
    newSectionsData[index].orderNumber = index + 1
    newSectionsData[index + 1].orderNumber = index + 2
    
    setSectionsData(newSectionsData)
    
    // Call API to update section order
    await updateSectionOrder(newSectionsData)
  }

  const updateSectionOrder = async (sections: Section[]) => {
    try {
      await updateSectionOrderMutation.mutateAsync(
        sections.map(s => ({
          id: s.id,
          orderNumber: s.orderNumber
        }))
      )
      toast.success('Đã cập nhật thứ tự chương')
      refetchSections()
    } catch (error) {
      toast.error('Lỗi khi cập nhật thứ tự chương')
      console.error('Error updating section order:', error)
    }
  }

  const handleSectionDragStart = (index: number) => {
    setDraggedSection(index)
  }

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleSectionDrop = async (targetIndex: number) => {
    if (draggedSection === null || draggedSection === targetIndex || !Array.isArray(sectionsData)) {
      setDraggedSection(null)
      return
    }

    const newSectionsData = [...sectionsData]
    const [movedSection] = newSectionsData.splice(draggedSection, 1)
    newSectionsData.splice(targetIndex, 0, movedSection)

    // Update order numbers
    newSectionsData.forEach((sectionData, idx) => {
      sectionData.orderNumber = idx + 1
    })

    setSectionsData(newSectionsData)
    setDraggedSection(null)

    // Call API to update section order
    await updateSectionOrder(newSectionsData)
  }

  const handleDeleteSectionConfirm = async () => {
    if (!deletingSectionId) return

    try {
      await deleteSectionMutation.mutateAsync(deletingSectionId)
      setDeleteSectionId(null)
      setDeleteSectionTitle("")
      toast.success('Đã xóa chương thành công')
      refetchSections()
    } catch (error) {
      toast.error('Lỗi khi xóa chương')
      console.error('Error deleting section:', error)
    }
  }

  const handleDeleteLessonConfirm = async () => {
    if (!deletingLessonId) return

    try {
      await deleteLessonMutation.mutateAsync(deletingLessonId)
      setDeleteLessonId(null)
      setDeleteLessonTitle("")
      toast.success('Đã xóa bài học thành công')
      refetchSections()
    } catch (error) {
      toast.error('Lỗi khi xóa bài học')
      console.error('Error deleting lesson:', error)
    }
  }

  const totalLessons = Array.isArray(sectionsData) 
    ? sectionsData.reduce((sum, s) => sum + (s.lessons?.length || 0), 0)
    : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Không tìm thấy khóa học</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/courses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-muted-foreground">
            Quản lý chương và bài học - Kéo thả để sắp xếp
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/staff/courses/${courseSlug}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa khóa học
            </Button>
          </Link>
          <Button onClick={() => setIsCreateSectionModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm chương
          </Button>
        </div>
      </div>

      {/* Course Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Danh mục</p>
              <p className="font-medium">{course.categoryName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số chương</p>
              <p className="font-medium">{Array.isArray(sectionsData) ? sectionsData.length : 0} chương</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số bài học</p>
              <p className="font-medium">{totalLessons} bài</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời lượng</p>
              <p className="font-medium">{formatDuration(course.totalDuration)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections and Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Nội dung khóa học</CardTitle>
          <CardDescription>
            Kéo thả bài học để sắp xếp hoặc di chuyển giữa các chương
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Array.isArray(sectionsData) && sectionsData.map((sectionData, sectionIndex) => (
              <AccordionItem 
                key={sectionData.id} 
                value={sectionData.id}
                className={`border rounded-lg mb-4 px-4 transition-all ${
                  draggedSection === sectionIndex 
                    ? 'opacity-50 scale-95' 
                    : ''
                }`}
                draggable
                onDragStart={() => handleSectionDragStart(sectionIndex)}
                onDragOver={handleSectionDragOver}
                onDrop={() => handleSectionDrop(sectionIndex)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="flex flex-col gap-1 py-2 cursor-move"
                    title="Kéo để di chuyển chương"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Chương {sectionData.orderNumber}
                        </Badge>
                        <span className="font-semibold text-lg">
                          {sectionData.title}
                        </span>
                      </div>
                      <Badge variant="secondary" className="ml-auto mr-4">
                        {sectionData.lessons?.length || 0} bài học
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setEditingSectionId(sectionData.id)
                          setEditingSectionTitle(sectionData.title)
                          setEditingSectionOrderNumber(sectionData.orderNumber)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa chương
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/courses/${courseSlug}/sections/${sectionData.id}/lessons/new`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm bài học
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => moveSectionUp(sectionIndex)}
                        disabled={sectionIndex === 0}
                      >
                        ↑ Di chuyển lên
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => moveSectionDown(sectionIndex)}
                        disabled={sectionIndex === (Array.isArray(sectionsData) ? sectionsData.length - 1 : 0)}
                      >
                        ↓ Di chuyển xuống
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setDeleteSectionId(sectionData.id)
                          setDeleteSectionTitle(sectionData.title)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa chương
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <AccordionContent>
                  <div 
                    className="space-y-2 p-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleDrop(sectionData.id, sectionData.lessons?.length || 0)
                    }}
                  >
                    {(!sectionData.lessons || sectionData.lessons.length === 0) ? (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Chưa có bài học. Kéo bài học vào đây hoặc tạo mới.</p>
                        <Link href={`/staff/courses/${courseSlug}/sections/${sectionData.id}/lessons/new`}>
                          <Button variant="link" className="mt-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm bài học đầu tiên
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      sectionData.lessons.map((lesson, lessonIndex) => {
                        const typeInfo = lessonTypeMap[lesson.type]
                        const TypeIcon = typeInfo.icon
                        
                        return (
                          <div
                            key={lesson.id}
                            draggable
                            onDragStart={() => handleDragStart(lesson, sectionData.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.stopPropagation()
                              handleDrop(sectionData.id, lessonIndex)
                            }}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-move
                              transition-colors
                              ${draggedLesson?.lesson.id === lesson.id ? 'opacity-50' : ''}
                            `}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Badge variant="outline" className="w-8 justify-center flex-shrink-0">
                              {lesson.orderNumber}
                            </Badge>
                            <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{lesson.title}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {lesson.content}
                              </p>
                            </div>
                            <Badge className={`${typeInfo.color} flex-shrink-0`}>
                              {typeInfo.text}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex-shrink-0">
                              {formatDuration(lesson.duration)}
                            </span>
                            {lesson.requireRobot && (
                              <Badge variant="secondary" className="flex-shrink-0">
                                Robot
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => router.push(`/staff/lessons/${lesson.id}`)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => router.push(`/staff/lessons/${lesson.id}/edit`)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => {
                                    setDeleteLessonId(lesson.id)
                                    setDeleteLessonTitle(lesson.title)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )
                      })
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {(!Array.isArray(sectionsData) || sectionsData.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Chưa có chương nào</p>
              <p className="mb-4">Hãy tạo chương đầu tiên cho khóa học này</p>
              <Button onClick={() => setIsCreateSectionModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo chương đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Section Modal */}
      <CreateSectionModal
        open={isCreateSectionModalOpen}
        onOpenChange={setIsCreateSectionModalOpen}
        courseId={courseId}
        onSuccess={() => {
          refetchSections()
          toast.success('Đã tạo chương thành công')
        }}
      />

      {/* Edit Section Modal */}
      <EditSectionModal
        open={!!editingSectionId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSectionId(null)
            setEditingSectionTitle("")
            setEditingSectionOrderNumber(0)
          }
        }}
        sectionId={editingSectionId || ""}
        currentTitle={editingSectionTitle}
        currentOrderNumber={editingSectionOrderNumber}
        onSuccess={() => {
          refetchSections()
        }}
      />

      {/* Delete Section Dialog */}
      <DeleteSectionDialog
        open={!!deletingSectionId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteSectionId(null)
            setDeleteSectionTitle("")
          }
        }}
        onConfirm={handleDeleteSectionConfirm}
        isDeleting={deleteSectionMutation.isPending}
        sectionTitle={deletingSectionTitle}
      />

      {/* Delete Lesson Dialog */}
      <DeleteLessonDialog
        open={!!deletingLessonId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteLessonId(null)
            setDeleteLessonTitle("")
          }
        }}
        onConfirm={handleDeleteLessonConfirm}
        isDeleting={deleteLessonMutation.isPending}
        lessonTitle={deletingLessonTitle}
      />
    </div>
  )
}

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
  FileText,
  MoveUp,
  MoveDown,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useStaffCourse } from "@/features/courses/hooks/use-course"
import { useSections, useDeleteSection, useUpdateSectionOrder } from "@/features/courses/hooks/use-section"
import { toast } from "sonner"
import { Section } from "@/types/courses"
import { DeleteSectionDialog } from "@/components/course/delete-section-dialog"

export default function CourseSectionsPage() {
  const params = useParams()
  const courseSlug = params.slug as string
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null)
  const [deletingSectionName, setDeletingSectionName] = useState("")
  
  const { data: course, isLoading: courseLoading } = useStaffCourse(courseSlug)
  const courseId = course?.id ?? ''
  
  const { data: sections = [], isLoading: sectionsLoading, refetch: refetchSections } = useSections(courseId)
  const deleteSectionMutation = useDeleteSection(courseId)
  const updateSectionOrderMutation = useUpdateSectionOrder(courseId)
  
  const isLoading = courseLoading || sectionsLoading

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return
    
    // Swap sections
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    // Update order numbers
    newSections[index].orderNumber = index + 1
    newSections[targetIndex].orderNumber = targetIndex + 1
    
    try {
      await updateSectionOrderMutation.mutateAsync(
        newSections.map(s => ({
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

  const handleDeleteSection = (sectionId: string, sectionName: string) => {
    setDeletingSectionId(sectionId)
    setDeletingSectionName(sectionName)
  }

  const handleDeleteSectionConfirm = async () => {
    if (!deletingSectionId) return
    
    try {
      await deleteSectionMutation.mutateAsync(deletingSectionId)
      setDeletingSectionId(null)
      setDeletingSectionName("")
      toast.success('Đã xóa chương thành công')
      // No need to manually refetch - the mutation already invalidates queries
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lỗi khi xóa chương'
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Lỗi khi xóa chương'
      toast.error(errorMessage)
      console.error('Error deleting section:', error)
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
          <h1 className="text-3xl font-bold tracking-tight">{course?.name}</h1>
          <p className="text-muted-foreground">
            Quản lý các chương học
          </p>
        </div>
        <Link href={`/staff/courses/${courseSlug}/sections/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm chương mới
          </Button>
        </Link>
      </div>

      {/* Course Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Danh mục</p>
              <p className="font-medium">{course?.categoryName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số chương</p>
              <p className="font-medium">{sections.length} chương</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số bài học</p>
              <p className="font-medium">{course?.totalLessons || 0} bài</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời lượng</p>
              <p className="font-medium">{course?.totalDuration ? formatDuration(course.totalDuration) : '0h 0m'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chương</CardTitle>
          <CardDescription>
            {sections.length} chương trong khóa học này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Tên chương</TableHead>
                  <TableHead>Số bài học</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Chưa có chương nào. Hãy tạo chương đầu tiên!
                    </TableCell>
                  </TableRow>
                ) : (
                  sections.map((section, index) => (
                    <TableRow key={section.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-medium">{section.orderNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{section.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {section.lessons?.length || 0} bài
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sections.length - 1}
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
                                <Link href={`/staff/courses/${courseSlug}/sections/${section.id}/lessons`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Quản lý bài học
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteSection(section.id, section.title)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteSectionDialog
        open={!!deletingSectionId}
        sectionTitle={deletingSectionName}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSectionId(null)
            setDeletingSectionName("")
          }
        }}
        onConfirm={handleDeleteSectionConfirm}
        isDeleting={deleteSectionMutation.isPending}
      />
    </div>
  )
}

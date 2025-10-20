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
  MoveDown
} from "lucide-react"
import Link from "next/link"

// Mock data
const mockCourse = {
  id: "c1",
  name: "Python cho người mới bắt đầu",
  description: "Khóa học Python từ cơ bản đến nâng cao",
  categoryName: "Lập trình cơ bản",
  level: 3,
  totalLessons: 24,
  totalDuration: 14400,
  status: 1,
  price: 299000,
}

const mockSections = [
  {
    id: "s1",
    courseId: "c1",
    title: "Giới thiệu về Python",
    orderNumber: 1,
    lessonsCount: 6,
    totalDuration: 3600,
    createdDate: "2024-02-01"
  },
  {
    id: "s2",
    courseId: "c1",
    title: "Cấu trúc dữ liệu cơ bản",
    orderNumber: 2,
    lessonsCount: 8,
    totalDuration: 4800,
    createdDate: "2024-02-05"
  },
  {
    id: "s3",
    courseId: "c1",
    title: "Vòng lặp và điều kiện",
    orderNumber: 3,
    lessonsCount: 6,
    totalDuration: 3600,
    createdDate: "2024-02-10"
  },
  {
    id: "s4",
    courseId: "c1",
    title: "Hàm và Module",
    orderNumber: 4,
    lessonsCount: 4,
    totalDuration: 2400,
    createdDate: "2024-02-15"
  }
]

export default function CourseSectionsPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course] = useState(mockCourse)
  const [sections, setSections] = useState(mockSections)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return
    
    // Swap sections
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    // Update order numbers
    newSections[index].orderNumber = index + 1
    newSections[targetIndex].orderNumber = targetIndex + 1
    
    setSections(newSections)
    
    // TODO: Call API to update order
    console.log('Reordering sections:', newSections.map(s => s.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/staff/courses/${courseId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-muted-foreground">
            Quản lý các chương học
          </p>
        </div>
        <Link href={`/staff/courses/${courseId}/sections/new`}>
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
              <p className="font-medium">{course.categoryName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số chương</p>
              <p className="font-medium">{sections.length} chương</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số bài học</p>
              <p className="font-medium">{course.totalLessons} bài</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời lượng</p>
              <p className="font-medium">{formatDuration(course.totalDuration)}</p>
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
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                          {section.lessonsCount} bài
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(section.totalDuration)}</TableCell>
                      <TableCell>
                        {new Date(section.createdDate).toLocaleDateString('vi-VN')}
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
                                <Link href={`/staff/courses/${courseId}/sections/${section.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${courseId}/sections/${section.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${courseId}/sections/${section.id}/lessons`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Quản lý bài học
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

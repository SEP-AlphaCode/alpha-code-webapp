"use client"

import { useState } from "react"
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
  FileText,
  Layers
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

const mockData = [
  {
    section: {
      id: "s1",
      courseId: "c1",
      title: "Giới thiệu về Python",
      orderNumber: 1,
      createdDate: "2024-02-01"
    },
    lessons: [
      {
        id: "l1",
        sectionId: "s1",
        title: "Python là gì?",
        content: "Giới thiệu về ngôn ngữ lập trình Python",
        videoUrl: "https://example.com/video1.mp4",
        duration: 600,
        requireRobot: false,
        type: 1,
        orderNumber: 1,
      },
      {
        id: "l2",
        sectionId: "s1",
        title: "Cài đặt môi trường Python",
        content: "Hướng dẫn cài đặt Python và IDE",
        videoUrl: "https://example.com/video2.mp4",
        duration: 900,
        requireRobot: false,
        type: 1,
        orderNumber: 2,
      },
      {
        id: "l3",
        sectionId: "s1",
        title: "Viết chương trình Python đầu tiên",
        content: "Thực hành viết Hello World",
        videoUrl: null,
        duration: 1200,
        requireRobot: false,
        type: 2,
        orderNumber: 3,
      },
    ]
  },
  {
    section: {
      id: "s2",
      courseId: "c1",
      title: "Cấu trúc dữ liệu cơ bản",
      orderNumber: 2,
      createdDate: "2024-02-05"
    },
    lessons: [
      {
        id: "l4",
        sectionId: "s2",
        title: "List và Tuple",
        content: "Tìm hiểu về List và Tuple trong Python",
        videoUrl: "https://example.com/video4.mp4",
        duration: 1800,
        requireRobot: false,
        type: 1,
        orderNumber: 1,
      },
      {
        id: "l5",
        sectionId: "s2",
        title: "Dictionary và Set",
        content: "Làm việc với Dictionary và Set",
        videoUrl: "https://example.com/video5.mp4",
        duration: 1500,
        requireRobot: false,
        type: 1,
        orderNumber: 2,
      },
      {
        id: "l6",
        sectionId: "s2",
        title: "Bài kiểm tra: Cấu trúc dữ liệu",
        content: "Kiểm tra kiến thức về cấu trúc dữ liệu",
        videoUrl: null,
        duration: 600,
        requireRobot: false,
        type: 3,
        orderNumber: 3,
      },
    ]
  },
  {
    section: {
      id: "s3",
      courseId: "c1",
      title: "Vòng lặp và điều kiện",
      orderNumber: 3,
      createdDate: "2024-02-10"
    },
    lessons: [
      {
        id: "l7",
        sectionId: "s3",
        title: "Câu lệnh if-else",
        content: "Điều kiện trong Python",
        videoUrl: "https://example.com/video7.mp4",
        duration: 1200,
        requireRobot: false,
        type: 1,
        orderNumber: 1,
      },
      {
        id: "l8",
        sectionId: "s3",
        title: "Vòng lặp for",
        content: "Sử dụng vòng lặp for",
        videoUrl: null,
        duration: 1400,
        requireRobot: false,
        type: 2,
        orderNumber: 2,
      },
    ]
  }
]

const lessonTypeMap: { [key: number]: { text: string; icon: any; color: string } } = {
  1: { text: "Video", icon: Play, color: "bg-blue-500/10 text-blue-500" },
  2: { text: "Lập trình", icon: Code, color: "bg-green-500/10 text-green-500" },
  3: { text: "Kiểm tra", icon: CheckCircle2, color: "bg-purple-500/10 text-purple-500" }
}

type Lesson = {
  id: string
  sectionId: string
  title: string
  content: string
  videoUrl: string | null
  duration: number
  requireRobot: boolean
  type: number
  orderNumber: number
}

type SectionWithLessons = {
  section: {
    id: string
    courseId: string
    title: string
    orderNumber: number
    createdDate: string
  }
  lessons: Lesson[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const [course] = useState(mockCourse)
  const [sectionsData, setSectionsData] = useState<SectionWithLessons[]>(mockData)
  const [draggedLesson, setDraggedLesson] = useState<{ lesson: Lesson; sectionId: string } | null>(null)
  const [draggedSection, setDraggedSection] = useState<number | null>(null)

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

  const handleDrop = (targetSectionId: string, targetIndex: number) => {
    if (!draggedLesson) return

    const newSectionsData = [...sectionsData]
    const sourceSectionIndex = newSectionsData.findIndex(
      s => s.section.id === draggedLesson.sectionId
    )
    const targetSectionIndex = newSectionsData.findIndex(
      s => s.section.id === targetSectionId
    )

    if (sourceSectionIndex === -1 || targetSectionIndex === -1) return

    // Remove lesson from source
    const sourceLessons = [...newSectionsData[sourceSectionIndex].lessons]
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
      : [...newSectionsData[targetSectionIndex].lessons]
    
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

    // TODO: Call API to update lesson order
    console.log('Moved lesson:', movedLesson.id, 'to section:', targetSectionId, 'at index:', targetIndex)
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const newSectionsData = [...sectionsData]
    const temp = newSectionsData[index]
    newSectionsData[index] = newSectionsData[index - 1]
    newSectionsData[index - 1] = temp
    
    // Update order numbers
    newSectionsData[index].section.orderNumber = index + 1
    newSectionsData[index - 1].section.orderNumber = index
    
    setSectionsData(newSectionsData)
  }

  const moveSectionDown = (index: number) => {
    if (index === sectionsData.length - 1) return
    const newSectionsData = [...sectionsData]
    const temp = newSectionsData[index]
    newSectionsData[index] = newSectionsData[index + 1]
    newSectionsData[index + 1] = temp
    
    // Update order numbers
    newSectionsData[index].section.orderNumber = index + 1
    newSectionsData[index + 1].section.orderNumber = index + 2
    
    setSectionsData(newSectionsData)
  }

  const handleSectionDragStart = (index: number) => {
    setDraggedSection(index)
  }

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleSectionDrop = (targetIndex: number) => {
    if (draggedSection === null || draggedSection === targetIndex) {
      setDraggedSection(null)
      return
    }

    const newSectionsData = [...sectionsData]
    const [movedSection] = newSectionsData.splice(draggedSection, 1)
    newSectionsData.splice(targetIndex, 0, movedSection)

    // Update order numbers
    newSectionsData.forEach((sectionData, idx) => {
      sectionData.section.orderNumber = idx + 1
    })

    setSectionsData(newSectionsData)
    setDraggedSection(null)

    // TODO: Call API to update section order
    console.log('Moved section from index', draggedSection, 'to', targetIndex)
  }

  const totalLessons = sectionsData.reduce((sum, s) => sum + s.lessons.length, 0)

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
          <Link href={`/staff/courses/${courseId}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa khóa học
            </Button>
          </Link>
          <Link href={`/staff/courses/${courseId}/sections/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm chương
            </Button>
          </Link>
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
              <p className="font-medium">{course.categoryName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số chương</p>
              <p className="font-medium">{sectionsData.length} chương</p>
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
            {sectionsData.map((sectionData, sectionIndex) => (
              <AccordionItem 
                key={sectionData.section.id} 
                value={sectionData.section.id}
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
                          Chương {sectionData.section.orderNumber}
                        </Badge>
                        <span className="font-semibold text-lg">
                          {sectionData.section.title}
                        </span>
                      </div>
                      <Badge variant="secondary" className="ml-auto mr-4">
                        {sectionData.lessons.length} bài học
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
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/courses/${courseId}/sections/${sectionData.section.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa chương
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/courses/${courseId}/sections/${sectionData.section.id}/lessons/new`}>
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
                        disabled={sectionIndex === sectionsData.length - 1}
                      >
                        ↓ Di chuyển xuống
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
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
                      handleDrop(sectionData.section.id, sectionData.lessons.length)
                    }}
                  >
                    {sectionData.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Chưa có bài học. Kéo bài học vào đây hoặc tạo mới.</p>
                        <Link href={`/staff/courses/${courseId}/sections/${sectionData.section.id}/lessons/new`}>
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
                            onDragStart={() => handleDragStart(lesson, sectionData.section.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.stopPropagation()
                              handleDrop(sectionData.section.id, lessonIndex)
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
                                <DropdownMenuItem className="text-destructive">
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

          {sectionsData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Chưa có chương nào</p>
              <p className="mb-4">Hãy tạo chương đầu tiên cho khóa học này</p>
              <Link href={`/staff/courses/${courseId}/sections/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo chương đầu tiên
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

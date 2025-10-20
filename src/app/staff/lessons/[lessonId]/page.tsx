"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Play,
  Code,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Video,
  FileJson,
  LucideIcon
} from "lucide-react"
import Link from "next/link"

// Mock data
const mockLesson = {
  id: "l1",
  sectionId: "s1",
  sectionTitle: "Giới thiệu về Python",
  courseId: "c1",
  courseName: "Python cho người mới bắt đầu",
  title: "Python là gì?",
  content: `
    Python là một ngôn ngữ lập trình bậc cao, thông dịch và đa năng. 
    
    Được tạo ra bởi Guido van Rossum và phát hành lần đầu năm 1991, Python nhấn mạnh vào tính dễ đọc của code với việc sử dụng khoảng trắng đáng kể.
    
    **Đặc điểm chính:**
    - Cú pháp rõ ràng, dễ học
    - Hỗ trợ nhiều mô hình lập trình
    - Thư viện phong phú
    - Cộng đồng lớn và năng động
    
    **Ứng dụng:**
    - Phát triển web
    - Khoa học dữ liệu
    - Machine Learning
    - Automation
  `,
  videoUrl: "https://example.com/video1.mp4",
  duration: 600, // 10 minutes
  requireRobot: false,
  type: 1, // Video
  orderNumber: 1,
  solution: null,
  createdDate: "2024-02-01",
  lastUpdated: "2024-02-15"
}

const lessonTypeMap: { [key: number]: { text: string; icon: LucideIcon; color: string; bgColor: string } } = {
  1: { 
    text: "Bài học Video", 
    icon: Play, 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  2: { 
    text: "Bài tập Lập trình", 
    icon: Code, 
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  3: { 
    text: "Bài Kiểm tra", 
    icon: CheckCircle2, 
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string
  const [lesson] = useState(mockLesson)

  const typeInfo = lessonTypeMap[lesson.type]
  const TypeIcon = typeInfo.icon

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} phút ${remainingSeconds} giây`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/staff/courses" className="hover:text-foreground">
              Khóa học
            </Link>
            <span>/</span>
            <Link href={`/staff/courses/${lesson.courseId}`} className="hover:text-foreground">
              {lesson.courseName}
            </Link>
            <span>/</span>
            <span>{lesson.sectionTitle}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/staff/lessons/${lessonId}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Type and Status */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${typeInfo.bgColor}`}>
          <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
          <span className={`font-medium ${typeInfo.color}`}>{typeInfo.text}</span>
        </div>
        {lesson.requireRobot && (
          <Badge variant="secondary" className="px-3 py-1">
            Yêu cầu Robot Alpha
          </Badge>
        )}
        <Badge variant="outline" className="px-3 py-1">
          Bài {lesson.orderNumber}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Video Section */}
          {lesson.type === 1 && lesson.videoUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video bài học
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Video Player</p>
                    <p className="text-sm">{lesson.videoUrl}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {lesson.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 text-foreground">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Solution/Code */}
          {(lesson.type === 2 || lesson.type === 3) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  {lesson.type === 2 ? 'Hướng dẫn & Lời giải' : 'Câu hỏi & Đáp án'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.solution ? (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{JSON.stringify(lesson.solution, null, 2)}</code>
                  </pre>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileJson className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có dữ liệu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Thời lượng</p>
                  <p className="font-medium">{formatDuration(lesson.duration)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Khóa học</p>
                  <Link 
                    href={`/staff/courses/${lesson.courseId}`}
                    className="font-medium hover:underline"
                  >
                    {lesson.courseName}
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Chương</p>
                  <p className="font-medium">{lesson.sectionTitle}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(lesson.createdDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {lesson.lastUpdated && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cập nhật lần cuối</p>
                    <p className="font-medium">
                      {new Date(lesson.lastUpdated).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/staff/lessons/${lessonId}/edit`} className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa bài học
                </Button>
              </Link>
              <Link href={`/staff/courses/${lesson.courseId}`} className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Layers className="mr-2 h-4 w-4" />
                  Xem chương
                </Button>
              </Link>
              <Button 
                className="w-full justify-start" 
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa bài học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

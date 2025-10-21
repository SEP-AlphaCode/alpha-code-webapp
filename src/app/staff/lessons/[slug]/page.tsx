"use client"

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
  LucideIcon,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useLessonBySlug, useDeleteLesson } from "@/features/courses/hooks/use-lesson"
import { useStaffCourse } from "@/features/courses/hooks"
import { toast } from "sonner"

const lessonTypeMap: { [key: number]: { text: string; icon: LucideIcon; color: string; bgColor: string } } = {
  1: { 
    text: "Bài học", 
    icon: Code, 
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  2: { 
    text: "Video", 
    icon: Play, 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  3: { 
    text: "Bài kiểm tra", 
    icon: CheckCircle2, 
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonSlug = params.slug as string
  
  const { data: lesson, isLoading } = useLessonBySlug(lessonSlug)
  const deleteLessonMutation = useDeleteLesson('')
  
  const handleDelete = async () => {
    if (!lesson) return
    
    if (confirm(`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?`)) {
      try {
        await deleteLessonMutation.mutateAsync(lesson.id)
        toast.success('Đã xóa bài học')
        router.back()
      } catch (error) {
        toast.error('Lỗi khi xóa bài học')
        console.error('Error deleting lesson:', error)
      }
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Không tìm thấy bài học</p>
      </div>
    )
  }

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
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/staff/lessons/${lessonSlug}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={handleDelete}
            disabled={deleteLessonMutation.isPending}
          >
            {deleteLessonMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
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
                {lesson.content.split('\n').map((paragraph: string, index: number) => (
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
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Thứ tự</p>
                  <p className="font-medium">Bài {lesson.orderNumber}</p>
                </div>
              </div>
              
              <Separator />

              <div className="flex items-center gap-3">
                <FileJson className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Loại bài học</p>
                  <Badge className={`${typeInfo.color}`}>
                    {typeInfo.text}
                  </Badge>
                </div>
              </div>
              
              {lesson.requireRobot && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Yêu cầu</p>
                      <Badge variant="secondary">Robot Alpha</Badge>
                    </div>
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
              <Link href={`/staff/lessons/${lessonSlug}/edit`} className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa bài học
                </Button>
              </Link>
              <Button 
                className="w-full justify-start" 
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLessonMutation.isPending}
              >
                {deleteLessonMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Xóa bài học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

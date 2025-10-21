"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLessonBySlug, useUpdateLesson } from "@/features/courses/hooks/use-lesson"
import { toast } from "sonner"

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonSlug = params.slug as string

  const { data: lesson, isLoading } = useLessonBySlug(lessonSlug)
  
  const [formData, setFormData] = useState({
    sectionId: "",
    title: "",
    content: "",
    videoUrl: "",
    duration: "",
    requireRobot: false,
    type: "1",
    solution: ""
  })

  // Update form when lesson data is loaded
  useEffect(() => {
    if (lesson) {
      setFormData({
        sectionId: lesson.sectionId,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl || "",
        duration: lesson.duration.toString(),
        requireRobot: lesson.requireRobot,
        type: lesson.type.toString(),
        solution: lesson.solution ? JSON.stringify(lesson.solution, null, 2) : ""
      })
    }
  }, [lesson])

  const updateLessonMutation = useUpdateLesson(
    lesson?.sectionId || '', 
    lesson?.id || '', 
    lesson?.sectionId
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!lesson) return

    try {
      await updateLessonMutation.mutateAsync({
        title: formData.title,
        content: formData.content,
        videoUrl: formData.videoUrl || undefined,
        duration: parseInt(formData.duration),
        requireRobot: formData.requireRobot,
        type: parseInt(formData.type),
        orderNumber: lesson.orderNumber,
        solution: formData.solution ? JSON.parse(formData.solution) : undefined,
      })
      
      toast.success('Đã cập nhật bài học')
      router.push(`/staff/lessons/${lessonSlug}`)
    } catch (error) {
      toast.error('Lỗi khi cập nhật bài học')
      console.error('Error updating lesson:', error)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/staff/lessons/${lessonSlug}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài học</h1>
          <p className="text-muted-foreground">{lesson.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Thông tin chính của bài học
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên bài học *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tên bài học"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (giây) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="600"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.duration && `${Math.floor(Number(formData.duration) / 60)} phút ${Number(formData.duration) % 60} giây`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung bài học"
                    rows={10}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Type-specific Fields */}
            {formData.type === "1" && (
              <Card>
                <CardHeader>
                  <CardTitle>Video</CardTitle>
                  <CardDescription>
                    URL video cho bài học
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">URL Video</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {(formData.type === "2" || formData.type === "3") && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {formData.type === "2" ? "Hướng dẫn & Lời giải" : "Câu hỏi & Đáp án"}
                  </CardTitle>
                  <CardDescription>
                    Dữ liệu JSON cho {formData.type === "2" ? "bài tập lập trình" : "bài kiểm tra"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution (JSON)</Label>
                    <Textarea
                      id="solution"
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      placeholder={formData.type === "2" 
                        ? '{\n  "hints": ["Gợi ý 1", "Gợi ý 2"],\n  "solution": "print(\\"Hello\\")",\n  "testCases": []\n}'
                        : '{\n  "questions": [],\n  "answers": []\n}'
                      }
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loại bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="1" id="type-video" />
                    <Label htmlFor="type-video" className="font-normal cursor-pointer">
                      Bài học Video
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="2" id="type-code" />
                    <Label htmlFor="type-code" className="font-normal cursor-pointer">
                      Bài tập Lập trình
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="type-quiz" />
                    <Label htmlFor="type-quiz" className="font-normal cursor-pointer">
                      Bài Kiểm tra
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireRobot">Yêu cầu Robot</Label>
                    <p className="text-sm text-muted-foreground">
                      Bài học cần robot Alpha
                    </p>
                  </div>
                  <Switch
                    id="requireRobot"
                    checked={formData.requireRobot}
                    onCheckedChange={(checked) => setFormData({ ...formData, requireRobot: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thao tác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateLessonMutation.isPending}
                >
                  {updateLessonMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
                <Link href={`/staff/lessons/${lessonSlug}`} className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Hủy
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

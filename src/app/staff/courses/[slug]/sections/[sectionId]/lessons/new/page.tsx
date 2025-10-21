"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStaffCourse } from "@/features/courses/hooks/use-course"
import { useCreateLesson } from "@/features/courses/hooks/use-lesson"
import { toast } from "sonner"

export default function NewLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseSlug = params.slug as string
  const sectionId = params.sectionId as string
  
  const { data: course } = useStaffCourse(courseSlug)
  const courseId = course?.id ?? ''
  
  const createLessonMutation = useCreateLesson(courseId, sectionId, courseSlug)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    duration: 0,
    requireRobot: false,
    type: "1", // 1: Bài học, 2: Video, 3: Kiểm tra
    solution: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài học")
      return
    }
    
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài học")
      return
    }
    
    if (formData.duration <= 0) {
      toast.error("Thời lượng phải lớn hơn 0")
      return
    }
    
    // Validate video file for video type
    if (formData.type === "2" && !videoFile) {
      toast.error("Vui lòng tải lên file video")
      return
    }

    try {
      let solutionObject = undefined
      if (formData.solution.trim()) {
        try {
          solutionObject = JSON.parse(formData.solution)
        } catch (error) {
          toast.error("Solution JSON không hợp lệ")
          return
        }
      }

      await createLessonMutation.mutateAsync({
        title: formData.title.trim(),
        content: formData.content.trim(),
        videoFile: videoFile || undefined,
        duration: formData.duration,
        requireRobot: formData.requireRobot,
        type: parseInt(formData.type),
        solution: solutionObject
      })
      
      toast.success("Tạo bài học thành công!")
    } catch (error) {
      console.error("Error creating lesson:", error)
      toast.error("Lỗi khi tạo bài học")
    }
  }

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/staff/courses/${courseSlug}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo bài học mới</h1>
          <p className="text-muted-foreground">
            Thêm bài học mới vào chương
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Điền thông tin chi tiết cho bài học
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài học *</Label>
                <Input
                  id="title"
                  placeholder="VD: Giới thiệu về Python"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Loại bài học *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Bài học</SelectItem>
                    <SelectItem value="2">Video</SelectItem>
                    <SelectItem value="3">Kiểm tra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung bài học *</Label>
                <Textarea
                  id="content"
                  placeholder="Mô tả chi tiết nội dung bài học..."
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (giây) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="600"
                    value={formData.duration || ""}
                    onChange={(e) => handleChange("duration", parseInt(e.target.value) || 0)}
                    required
                    min={0}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.duration > 0 && (
                      <>Tương đương: {Math.floor(formData.duration / 60)} phút {formData.duration % 60} giây</>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requireRobot">Yêu cầu Robot</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="requireRobot"
                      checked={formData.requireRobot}
                      onCheckedChange={(checked) => handleChange("requireRobot", checked)}
                    />
                    <Label htmlFor="requireRobot" className="font-normal">
                      Bài học này cần sử dụng Robot Alpha
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Content - Only for type 2 (Video) */}
          {formData.type === "2" && (
            <Card>
              <CardHeader>
                <CardTitle>Nội dung Video</CardTitle>
                <CardDescription>
                  Thêm video cho bài học
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoFile">Tải lên Video</Label>
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setVideoFile(file)
                      }
                    }}
                  />
                  {videoFile && (
                    <p className="text-sm text-green-600">
                      Đã chọn: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Chọn file video từ máy tính (MP4, AVI, MOV, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coding Content
          {formData.type === "1" && (
            <Card>
              <CardHeader>
                <CardTitle>Nội dung bài học</CardTitle>
                <CardDescription>
                  Cấu hình bài tập lập trình
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="instructions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="instructions">Hướng dẫn</TabsTrigger>
                    <TabsTrigger value="solution">Lời giải (JSON)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="instructions" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Hướng dẫn làm bài</Label>
                      <Textarea
                        placeholder="Hướng dẫn chi tiết cách làm bài tập..."
                        rows={8}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="solution" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="solution">Solution (JSON)</Label>
                      <Textarea
                        id="solution"
                        placeholder='{"steps": [], "code": ""}'
                        value={formData.solution}
                        onChange={(e) => handleChange("solution", e.target.value)}
                        rows={10}
                        className="font-mono text-sm"
                      />
                      <p className="text-sm text-muted-foreground">
                        Định dạng JSON cho lời giải bài tập
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )} */}

          {/* Quiz Content */}
          {formData.type === "3" && (
            <Card>
              <CardHeader>
                <CardTitle>Nội dung Kiểm tra</CardTitle>
                <CardDescription>
                  Cấu hình bài kiểm tra
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="solution">Câu hỏi và đáp án (JSON)</Label>
                  <Textarea
                    id="solution"
                    placeholder='{"questions": [{"question": "...", "answers": [], "correct": 0}]}'
                    value={formData.solution}
                    onChange={(e) => handleChange("solution", e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Định dạng JSON cho câu hỏi và đáp án
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-4">
                <Link href={`/staff/courses/${courseSlug}`}>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Đang lưu..." : "Lưu bài học"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

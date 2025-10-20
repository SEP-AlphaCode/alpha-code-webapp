"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

// Mock data
const mockLesson = {
  id: "l1",
  sectionId: "s1",
  sectionTitle: "Giới thiệu về Python",
  courseId: "c1",
  courseName: "Python cho người mới bắt đầu",
  title: "Python là gì?",
  content: `Python là một ngôn ngữ lập trình bậc cao, thông dịch và đa năng. 

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
- Automation`,
  videoUrl: "https://example.com/video1.mp4",
  duration: 600, // 10 minutes
  requireRobot: false,
  type: 1, // Video
  orderNumber: 1,
  solution: null
}

const mockSections = [
  { id: "s1", title: "Giới thiệu về Python", orderNumber: 1 },
  { id: "s2", title: "Biến và kiểu dữ liệu", orderNumber: 2 },
  { id: "s3", title: "Cấu trúc điều khiển", orderNumber: 3 }
]

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string

  const [formData, setFormData] = useState({
    sectionId: mockLesson.sectionId,
    title: mockLesson.title,
    content: mockLesson.content,
    videoUrl: mockLesson.videoUrl || "",
    duration: mockLesson.duration.toString(),
    requireRobot: mockLesson.requireRobot,
    type: mockLesson.type.toString(),
    solution: mockLesson.solution ? JSON.stringify(mockLesson.solution, null, 2) : ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Update lesson:", formData)
    // TODO: API call to update lesson
    router.push(`/staff/lessons/${lessonId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/staff/lessons/${lessonId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/staff/courses" className="hover:text-foreground">
              Khóa học
            </Link>
            <span>/</span>
            <Link href={`/staff/courses/${mockLesson.courseId}`} className="hover:text-foreground">
              {mockLesson.courseName}
            </Link>
            <span>/</span>
            <Link href={`/staff/lessons/${lessonId}`} className="hover:text-foreground">
              {mockLesson.title}
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài học</h1>
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
                  <Label htmlFor="section">Chương</Label>
                  <select
                    id="section"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    required
                  >
                    {mockSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>

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
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
                <Link href={`/staff/lessons/${lessonId}`} className="block">
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

"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Send, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import lessonApi from '@/services/lesson-api'

interface LessonData {
  title: string
  content: string
  duration: number
  requireRobot: boolean
  courseId: string
  type: number
  solution: {
    action: string
  }
}

export default function TestLessonUploadPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [lessonData, setLessonData] = useState<LessonData>({
    title: "Lesson 1",
    content: "Intro",
    duration: 100,
    requireRobot: true,
    courseId: "b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7",
    type: 1,
    solution: { action: "wave" }
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      toast.success(`Đã chọn file: ${file.name}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Vui lòng chọn file video')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      // Tạo FormData theo đúng format yêu cầu
      const formData = new FormData()
      
      // Append lesson data as JSON blob
      formData.append(
        "createLesson",
        new Blob([JSON.stringify(lessonData)], { type: "application/json" })
      )
      
      // Append video file
      formData.append("videoFile", selectedFile)

      console.log('Sending request with data:', lessonData)
      console.log('File:', selectedFile.name, selectedFile.type, selectedFile.size)

      // Gửi request
      const response = await lessonApi.post("/api/v1/lessons", formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        }
      })

      setResult(response.data)
      toast.success('Upload lesson thành công!')
      
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
      setError(errorMessage)
      toast.error(`Upload thất bại: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const loadSampleData = () => {
    setLessonData({
      title: "Sample Lesson - Robot Movement",
      content: "This lesson teaches basic robot movement and wave gesture",
      duration: 120,
      requireRobot: true,
      courseId: "b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7",
      type: 1,
      solution: { action: "wave" }
    })
    toast.success('Đã load sample data')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Lesson Upload API</h1>
        <p className="text-muted-foreground">
          Trang test để thử nghiệm API upload lesson với FormData và file
        </p>
      </div>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base text-blue-700">Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Điền thông tin lesson vào form bên trái</li>
            <li>Chọn file video (hỗ trợ các định dạng: mp4, avi, mov, etc.)</li>
            <li>Nhấn "Upload Lesson" để gửi request</li>
            <li>Xem kết quả ở bên phải (success/error)</li>
            <li>Check Console để xem chi tiết request/response</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Lesson</CardTitle>
            <CardDescription>
              Điền thông tin lesson và chọn file video để upload
            </CardDescription>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={loadSampleData}
              disabled={loading}
            >
              Load Sample Data
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={lessonData.title}
                  onChange={(e) => setLessonData(prev => ({...prev, title: e.target.value}))}
                  placeholder="VD: Lesson 1"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea
                  id="content"
                  value={lessonData.content}
                  onChange={(e) => setLessonData(prev => ({...prev, content: e.target.value}))}
                  placeholder="VD: Intro"
                  rows={3}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Thời lượng (phút) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={lessonData.duration}
                    onChange={(e) => setLessonData(prev => ({...prev, duration: parseInt(e.target.value) || 0}))}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Loại lesson *</Label>
                  <Select 
                    value={lessonData.type.toString()} 
                    onValueChange={(value) => setLessonData(prev => ({...prev, type: parseInt(value)}))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Type 1</SelectItem>
                      <SelectItem value="2">Type 2</SelectItem>
                      <SelectItem value="3">Type 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="courseId">Course ID *</Label>
                <Input
                  id="courseId"
                  value={lessonData.courseId}
                  onChange={(e) => setLessonData(prev => ({...prev, courseId: e.target.value}))}
                  placeholder="VD: b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="action">Solution Action *</Label>
                <Input
                  id="action"
                  value={lessonData.solution.action}
                  onChange={(e) => setLessonData(prev => ({
                    ...prev, 
                    solution: { action: e.target.value }
                  }))}
                  placeholder="VD: wave"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireRobot"
                  checked={lessonData.requireRobot}
                  onChange={(e) => setLessonData(prev => ({...prev, requireRobot: e.target.checked}))}
                  disabled={loading}
                  className="rounded"
                />
                <Label htmlFor="requireRobot">Yêu cầu robot</Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="videoFile">File video *</Label>
                <Input
                  ref={fileInputRef}
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                  disabled={loading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || !selectedFile} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang upload...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Upload Lesson
                    </>
                  )}
                </Button>
                
                <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* API Endpoint Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><strong>Endpoint:</strong> POST /api/v1/lessons</div>
              <div><strong>Content-Type:</strong> multipart/form-data</div>
              <div><strong>Fields:</strong></div>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>createLesson: JSON blob</li>
                <li>videoFile: File</li>
              </ul>
            </CardContent>
          </Card>

          {/* Success Result */}
          {result && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-base text-green-700 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Upload thành công
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-green-50 p-3 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Error Result */}
          {error && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-700 flex items-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  Upload thất bại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm bg-red-50 p-3 rounded text-red-700">
                  {error}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div><strong>Lesson Data:</strong></div>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(lessonData, null, 2)}
                </pre>
                <div><strong>File:</strong> {selectedFile ? selectedFile.name : 'Chưa chọn file'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
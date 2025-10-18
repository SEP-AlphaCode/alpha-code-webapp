"use client"

import { useState, useRef, useEffect } from 'react'
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
import { Send, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import lessonApi from '@/services/lesson-api'

interface LessonData {
  title: string
  content: string
  duration: number
  requireRobot: boolean
  sectionId: string
  type: number
  orderNumber: number
  solution: {
    action: string
  }
}

interface Section {
  id: string
  title: string
  orderNumber: number
  courseId: string
}

interface CreateSection {
  title: string
  courseId: string
  orderNumber: number
}

export default function TestLessonUploadPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Course ID state - cần thiết để fetch sections
  const [courseId, setCourseId] = useState("b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7")
  
  const [lessonData, setLessonData] = useState<LessonData>({
    title: "Lesson 1",
    content: "Intro",
    duration: 100,
    requireRobot: true,
    sectionId: "",
    orderNumber: 1,
    type: 1,
    solution: { action: "wave" }
  })

  const [sections, setSections] = useState<Section[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(false)
  
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [showAddSection, setShowAddSection] = useState(false)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch sections when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchSections()
    }
  }, [courseId])

  const fetchSections = async () => {
    try {
      setSectionsLoading(true)
      const response = await lessonApi.get(`/api/v1/sections/get-by-course/${courseId}`)
      console.log('Sections response:', response.data)
      setSections(response.data.data || [])
    } catch (error) {
      console.error('Error fetching sections:', error)
      toast.error('Không thể tải danh sách sections')
    } finally {
      setSectionsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      toast.success(`Đã chọn file: ${file.name}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!lessonData.sectionId) {
      toast.error('Vui lòng chọn section')
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
      
      // Append video file nếu có
      if (selectedFile) {
        formData.append("videoFile", selectedFile)
      }

      console.log('Sending request with data:', lessonData)
      if (selectedFile) {
        console.log('File:', selectedFile.name, selectedFile.type, selectedFile.size)
      } else {
        console.log('No file selected')
      }

      // Gửi request
      const response = await lessonApi.post("/api/v1/lessons", formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        }
      })

      setResult(response.data)
      toast.success('Upload lesson thành công!')
      
    } catch (error: unknown) {
      console.error('Upload error:', error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra'
      setError(errorMessage || 'Có lỗi xảy ra')
      toast.error(`Upload thất bại: ${errorMessage || 'Có lỗi xảy ra'}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setResult(null)
    setError(null)
    setCourseId("b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7")
    setLessonData({
      title: "Lesson 1",
      content: "Intro",
      duration: 100,
      requireRobot: true,
      sectionId: "",
      orderNumber: 1,
      type: 1,
      solution: { action: "wave" }
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const loadSampleData = () => {
    const sampleCourseId = "b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7"
    setCourseId(sampleCourseId)
    setLessonData({
      title: "Sample Lesson - Robot Movement",
      content: "This lesson teaches basic robot movement and wave gesture",
      duration: 120,
      requireRobot: true,
      sectionId: "",
      orderNumber: 1,
      type: 1,
      solution: { action: "wave" }
    })
    toast.success('Đã load sample data')
  }

  const addSection = async () => {
    if (!newSectionTitle.trim()) {
      toast.error('Vui lòng nhập tên section')
      return
    }

    if (!courseId) {
      toast.error('Vui lòng nhập Course ID trước')
      return
    }

    try {
      setLoading(true)
      const createSectionData: CreateSection = {
        title: newSectionTitle,
        courseId: courseId,
        orderNumber: sections.length + 1
      }

      await lessonApi.post('/api/v1/sections', createSectionData)
      
      setNewSectionTitle("")
      setShowAddSection(false)
      toast.success('Đã thêm section mới')
      
      // Refresh sections list
      await fetchSections()
    } catch (error) {
      console.error('Error creating section:', error)
      toast.error('Không thể tạo section mới')
    } finally {
      setLoading(false)
    }
  }

  const removeSection = async (sectionId: string) => {
    try {
      setLoading(true)
      await lessonApi.delete(`/api/v1/sections/${sectionId}`)
      
      if (lessonData.sectionId === sectionId) {
        setLessonData(prev => ({...prev, sectionId: ""}))
      }
      toast.success('Đã xóa section')
      
      // Refresh sections list
      await fetchSections()
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error('Không thể xóa section')
    } finally {
      setLoading(false)
    }
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
            <li>Nhấn &quot;Upload Lesson&quot; để gửi request</li>
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

              <div className="grid gap-2">
                <Label htmlFor="courseId">Course ID *</Label>
                <Input
                  id="courseId"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="VD: b3b9e34a-1b1b-4e1c-b23e-0ab3d97c93a7"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Thời lượng (giây) *</Label>
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

              {/* Section Management */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Sections *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchSections}
                      disabled={loading || sectionsLoading || !courseId}
                    >
                      {sectionsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '🔄'} Refresh
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddSection(true)}
                      disabled={loading || !courseId}
                    >
                      + Thêm Section
                    </Button>
                  </div>
                </div>
                
                {/* Add Section Form */}
                {showAddSection && (
                  <div className="flex gap-2 p-3 border rounded-lg bg-gray-50">
                    <Input
                      placeholder="Tên section mới..."
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSection()}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addSection}
                    >
                      Thêm
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddSection(false)
                        setNewSectionTitle("")
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                )}

                {/* Sections List */}
                <div className="space-y-2">
                  {sectionsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">Đang tải sections...</span>
                    </div>
                  ) : sections.length > 0 ? (
                    sections.map((section) => (
                      <div key={section.id} className="flex items-center gap-2 p-2 border rounded-lg">
                        <input
                          type="radio"
                          name="section"
                          value={section.id}
                          checked={lessonData.sectionId === section.id}
                          onChange={(e) => setLessonData(prev => ({...prev, sectionId: e.target.value}))}
                          disabled={loading}
                        />
                        <span className="flex-1 text-sm">{section.title}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          disabled={loading}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {courseId ? 'Chưa có section nào cho course này. Thêm section đầu tiên!' : 'Vui lòng nhập Course ID để tải sections'}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="orderNumber">Thứ tự *</Label>
                  <Input
                    id="orderNumber"
                    type="number"
                    min="1"
                    value={lessonData.orderNumber}
                    onChange={(e) => setLessonData(prev => ({...prev, orderNumber: parseInt(e.target.value) || 1}))}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Loại bài học *</Label>
                  <Select 
                    value={lessonData.type.toString()} 
                    onValueChange={(value) => setLessonData(prev => ({...prev, type: parseInt(value)}))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Loại 1</SelectItem>
                      <SelectItem value="2">Loại 2</SelectItem>
                      <SelectItem value="3">Loại 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <Label htmlFor="videoFile">File video (tùy chọn)</Label>
                <Input
                  ref={fileInputRef}
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit"  className="flex-1">
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
                  {result ? JSON.stringify(result, null, 2) : 'No result data'}
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
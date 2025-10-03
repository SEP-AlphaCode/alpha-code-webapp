"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Music, Clock, Copy, Sparkles, FileAudio, Download, Play, Save } from "lucide-react"
import { DancePlanReposnse } from "@/types/music"
import { ActionActivites } from "@/types/action"
import { Color } from "@/types/color"
import { createActivity } from "@/features/activities/api/activities-api"
import { Activity } from "@/types/activities"
import { getUserInfoFromToken } from "@/utils/tokenUtils"
import { toast } from "sonner"

// Helper function để extract error message từ API response
const getErrorMessage = (error: any): string => {
  if (error.response) {
    const status = error.response.status
    const responseData = error.response.data
    
    // Lấy message chi tiết từ API response nếu có
    if (responseData?.message) {
      return responseData.message
    } else if (responseData?.error) {
      return responseData.error
    } else if (responseData?.errors && Array.isArray(responseData.errors)) {
      // Nếu có nhiều errors, join chúng lại
      return responseData.errors.join(', ')
    } else {
      // Fallback messages theo status code
      switch (status) {
        case 400:
          return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!'
        case 401:
          return 'Bạn cần đăng nhập lại!'
        case 403:
          return 'Bạn không có quyền lưu activity!'
        case 422:
          return 'Dữ liệu không đúng định dạng. Vui lòng thử lại!'
        case 500:
          return 'Lỗi server. Vui lòng thử lại sau!'
        default:
          return `Lỗi ${status}: ${error.response.statusText || 'Không xác định'}`
      }
    }
  } else if (error.request) {
    // Network error
    return 'Không thể kết nối đến server. Vui lòng kiểm tra mạng!'
  } else {
    // Other errors
    return error.message || 'Có lỗi không xác định xảy ra!'
  }
}

export default function PreviewActivitiesPage() {
  const [dancePlan, setDancePlan] = useState<DancePlanReposnse | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [timeRange, setTimeRange] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityName, setActivityName] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Lấy dữ liệu từ URL params hoặc localStorage
    const data = searchParams.get('data')
    const file = searchParams.get('file')
    const range = searchParams.get('range')
    
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setDancePlan(parsedData)
      } catch (error) {
        console.error('Error parsing dance plan data:', error)
      }
    }
    
    if (file) {
      const decodedFileName = decodeURIComponent(file)
      setFileName(decodedFileName)
      
      // Set default activity name based on file name
      const nameWithoutExtension = decodedFileName.replace(/\.[^/.]+$/, "")
      setActivityName(`Dance Activity - ${nameWithoutExtension}`)
    }
    
    if (range) {
      setTimeRange(decodeURIComponent(range))
    }
    
    setLoading(false)
  }, [searchParams])

  const handleCopyActivities = () => {
    if (!dancePlan?.activity?.actions) return
    
    const activitiesText = dancePlan.activity.actions.map((action: ActionActivites, index: number) => 
      `Activity ${index + 1}: Action ID: ${action.action_id}\n` +
      `Type: ${action.action_type || 'N/A'}\n` +
      `Time: ${action.start_time}s - ${action.start_time + action.duration}s (${action.duration}s)\n` +
      `${action.color && action.color.length > 0 ? `Colors: ${action.color.map((c: Color) => `RGB(${c.r}, ${c.g}, ${c.b})`).join(', ')}\n` : ''}\n`
    ).join('\n')
    
    navigator.clipboard.writeText(activitiesText)
    toast.success("Dance activities đã được sao chép vào clipboard!")
  }

  const handleDownloadJSON = () => {
    if (!dancePlan) return
    
    const dataStr = JSON.stringify(dancePlan, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dance-plan-${fileName || 'activity'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Thông báo download thành công
    toast.success(`Đã tải xuống file: dance-plan-${fileName || 'activity'}.json`)
  }

  const handleSaveActivity = async () => {
    if (!dancePlan || !activityName.trim()) {
      toast.error("Vui lòng nhập tên cho activity!")
      return
    }

    try {
      setIsSaving(true)
      
      // Lấy thông tin user từ token
      const token = sessionStorage.getItem('accessToken')
      if (!token) {
        toast.error("Bạn cần đăng nhập để lưu activity!")
        return
      }

      const userInfo = getUserInfoFromToken(token)
      if (!userInfo?.id) {
        toast.error("Không thể lấy thông tin người dùng!")
        return
      }

      // Chuẩn bị data để save theo Activity type hiện tại
      const activityData: Omit<Activity, 'id' | 'createdDate' | 'lastUpdate'> = {
        accountId: userInfo.id,
        data: dancePlan, // Lưu trực tiếp object thay vì JSON string
        name: activityName.trim(),
        status: 1,
        type: "dance_with_music",
        statusText: "Active",
        robotModelId: "6e4e14b3-b073-4491-ab2a-2bf315b3259f"
      }

      await createActivity(activityData)
      toast.success(`Activity "${activityName}" đã được lưu thành công!`)
      setIsModalOpen(false)
      setActivityName("")
      
      // Có thể chuyển hướng về trang activities list
      // router.push('/teacher/activities')
      
    } catch (error: any) {
      console.error('Error saving activity:', error)
      
      // Log chi tiết để debug
      if (error.response) {
        console.error('API Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        })
      }
      
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-10">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-purple-200 rounded-lg rotate-12 opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-40 w-12 h-12 border-2 border-pink-200 rounded-md rotate-45 opacity-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-10 h-10 border-2 border-violet-200 rounded-sm -rotate-30 opacity-55 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 border-2 border-fuchsia-200 rounded-lg rotate-15 opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay Lại Studio Âm Nhạc
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold mb-6 shadow-lg">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Kế Hoạch Nhảy Đã Tạo
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Xem Trước Hành Động
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vũ đạo do AI tạo ra cho âm nhạc của bạn
            </p>
          </div>
        </div>

        {/* File Info */}
        {fileName && (
          <Card className="mb-8 border-0 bg-white/80 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-600 rounded-xl">
                  <FileAudio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{fileName}</h3>
                  {timeRange && (
                    <p className="text-sm text-gray-600">
                      Khoảng Thời Gian: {timeRange}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dance Activities */}
        {dancePlan?.activity?.actions && Array.isArray(dancePlan.activity.actions) ? (
          <div className="space-y-6">
            {/* Actions Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hành Động Nhảy Múa</h2>
                  <p className="text-sm text-gray-600">{dancePlan.activity.actions.length} chuỗi vũ đạo</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleCopyActivities}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Sao Chép Hành Động
                </Button>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu Hành Động
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Lưu Hành Động
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="activityName">Tên Hành Động</Label>
                        <Input
                          id="activityName"
                          placeholder="Nhập tên cho activity..."
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      {fileName && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <strong>File nguồn:</strong> {fileName}
                          {timeRange && (
                            <>
                              <br />
                              <strong>Thời gian:</strong> {timeRange}
                            </>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                          disabled={isSaving}
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSaveActivity}
                          disabled={!activityName.trim() || isSaving}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Lưu Activity
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  onClick={handleDownloadJSON}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải Xuống JSON
                </Button>
              </div>
            </div>

            {/* Activities List */}
            <div className="grid gap-6">
              {dancePlan.activity.actions.map((action: ActionActivites, index: number) => (
                <Card key={index} className="border-0 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-gray-500 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <CardTitle className="text-xl text-gray-900">
                            Activity {index + 1}
                          </CardTitle>
                          <p className="text-sm text-gray-600">Action ID: {action.action_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {action.action_type && (
                          <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                            {action.action_type}
                          </Badge>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
                          <Clock className="w-4 h-4" />
                          {action.start_time}s - {action.start_time + action.duration}s
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Action Details */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Chi Tiết Hành Động</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Thời gian bắt đầu:</span>
                              <span className="font-medium">{action.start_time}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Thời lượng:</span>
                              <span className="font-medium">{action.duration}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Thời gian kết thúc:</span>
                              <span className="font-medium">{action.start_time + action.duration}s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Colors */}
                      {action.color && Array.isArray(action.color) && action.color.length > 0 && (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Màu Sắc LED</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {action.color.map((color: Color, colorIndex: number) => {
                                const hexColor = `#${[color.r, color.g, color.b].map(x => x.toString(16).padStart(2, '0')).join('')}`
                                return (
                                  <div key={colorIndex} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                                    <div 
                                      className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm" 
                                      style={{ backgroundColor: hexColor }}
                                    />
                                    <div>
                                      <div className="text-xs font-medium text-gray-700">{hexColor.toUpperCase()}</div>
                                      <div className="text-xs text-gray-500">
                                        RGB({color.r}, {color.g}, {color.b})
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="border-0 bg-gray-50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {dancePlan.activity.actions.length}
                    </div>
                    <div className="text-sm text-gray-600">Tổng Số Hành Động</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {Math.max(...dancePlan.activity.actions.map(a => a.start_time + a.duration)).toFixed(1)}s
                    </div>
                    <div className="text-sm text-gray-600">Tổng Thời Lượng</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Không Tìm Thấy Hành Động</h3>
              <p className="text-gray-600 mb-6">
                Không có Hành động nhảy nào được tạo ra cho file âm nhạc này.
              </p>
              <details className="mt-6 p-4 bg-gray-50 rounded-lg text-left border">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">Xem dữ liệu thô</summary>
                <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {JSON.stringify(dancePlan, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
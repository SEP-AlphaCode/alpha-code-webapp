"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  FileAudio,
  Clock,
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  Music
} from "lucide-react"

import { DancePlanReposnse } from "@/types/music"
import { ActionActivites } from "@/types/action"
import { useCreateActivity } from "@/features/activities/hooks/use-activities"
import { Activity } from "@/types/activities"
import { getUserInfoFromToken } from "@/utils/tokenUtils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const getErrorMessage = (error: unknown): string => {
  console.error('Full error object:', error); // Debug log
  
  if (error && typeof error === 'object' && 'response' in error) {
    const httpError = error as { 
      response: { 
        status: number; 
        data?: { 
          message?: string; 
          error?: string;
          details?: string;
        } 
      };
      message?: string;
    }
    
    const errorData = httpError.response?.data;
    const serverMessage = errorData?.message || errorData?.error || errorData?.details;
    
    switch (httpError.response.status) {
      case 400: 
        return serverMessage || 'Dữ liệu không hợp lệ!'
      case 401: 
        return 'Bạn cần đăng nhập lại!'
      case 403: 
        return 'Không có quyền lưu hoạt động!'
      case 409:
        return serverMessage || 'Tên hoạt động đã tồn tại! Vui lòng chọn tên khác.'
      case 422:
        return serverMessage || 'Dữ liệu không đúng định dạng!'
      case 500: 
        return serverMessage || 'Lỗi server! Vui lòng thử lại sau.'
      default: 
        return serverMessage || 'Có lỗi xảy ra khi lưu hoạt động!'
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  
  return 'Có lỗi xảy ra khi lưu hoạt động!'
}

export default function PreviewActivitiesPage() {
  const [dancePlan, setDancePlan] = useState<DancePlanReposnse | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [timeRange, setTimeRange] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityName, setActivityName] = useState<string>("")
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Sử dụng hook để tạo activity (tắt toast tự động)
  const createActivityMutation = useCreateActivity({ showToast: false })

  useEffect(() => {
    console.log("Loading preview activity data from sessionStorage");
    const sessionDataKey = searchParams.get('sessionKey') || 'preview_activity_data'
    console.log( sessionDataKey);

    try {
      const sessionData = sessionStorage.getItem(sessionDataKey)
      if (sessionData) {
        const parsedSessionData = JSON.parse(sessionData)

        if (parsedSessionData.dancePlan) {
          setDancePlan(parsedSessionData.dancePlan)
        }
        if (parsedSessionData.fileName) {
          setFileName(parsedSessionData.fileName)
          const nameWithoutExtension = parsedSessionData.fileName.replace(/\.[^/.]+$/, "")
          setActivityName(`Hoạt động nhảy - ${nameWithoutExtension}`)
        }
        if (parsedSessionData.timeRange) {
          setTimeRange(parsedSessionData.timeRange)
        }
      }
    } catch (error) {
      console.error('Error loading preview data:', error)
      toast.error('Không thể tải dữ liệu preview!')
    }

    setLoading(false)
  }, [searchParams])

  const handleSaveActivity = async () => {
    if (!dancePlan || !activityName.trim()) {
      toast.error("Vui lòng nhập tên cho hoạt động!")
      return
    }

    // Validation chi tiết cho tên activity
    const trimmedName = activityName.trim()
    
    if (trimmedName.length < 3) {
      toast.error("Tên hoạt động phải có ít nhất 3 ký tự!")
      return
    }

    if (trimmedName.length > 100) {
      toast.error("Tên hoạt động không được quá 100 ký tự!")
      return
    }

    // Kiểm tra ký tự đặc biệt có thể gây lỗi
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(trimmedName)) {
      toast.error("Tên hoạt động không được chứa các ký tự đặc biệt: < > : \" / \\ | ? *")
      return
    }

    try {
      const token = sessionStorage.getItem('accessToken')
      if (!token) {
        toast.error("Bạn cần đăng nhập để lưu hoạt động!")
        return
      }

      const userInfo = getUserInfoFromToken(token)
      if (!userInfo?.id) {
        toast.error("Không thể lấy thông tin người dùng!")
        return
      }

      const activityData: Omit<Activity, 'id' | 'createdDate' | 'lastUpdate'> = {
        accountId: userInfo.id,
        data: dancePlan,
        name: trimmedName,
        status: 1,
        type: "dance_with_music",
        statusText: "ACTIVE",
        robotModelId: "6e4e14b3-b073-4491-ab2a-2bf315b3259f"
      }

      // Sử dụng hook mutation để tạo activity
      await createActivityMutation.mutateAsync(activityData)
      
      toast.success(`✅ Hoạt động "${trimmedName}" đã được lưu thành công!`)

      const sessionDataKey = searchParams.get('sessionKey') || 'preview_activity_data'
      sessionStorage.removeItem(sessionDataKey)

      setIsModalOpen(false)

      setTimeout(() => {
        router.push('/parent/activities')
      }, 1500)

    } catch (error: unknown) {
      console.error('Error saving activity:', error)
      const errorMessage = getErrorMessage(error)
      
      // Hiển thị thông báo lỗi chi tiết qua toast
      toast.error(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium">Đang tải dữ liệu...</span>
          </div>
        </Card>
      </div>
    )
  }

  if (!dancePlan?.activity?.actions || !Array.isArray(dancePlan.activity.actions)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Không có dữ liệu</h2>
            <p className="text-gray-600 mb-6">Không tìm thấy dance plan để hiển thị</p>
            <Button onClick={() => router.push('/user/music')}>
              Tạo kế hoạch nhảy mới
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const actions = dancePlan.activity.actions
  const totalDuration = Math.max(...actions.map(a => a.start_time + a.duration))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Music className="w-8 h-8 text-blue-600" />
            Xem trước hành động nhảy
          </h1>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md">
                <Save className="w-5 h-5" />
                Lưu hoạt động
              </Button>

            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lưu hoạt động nhảy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Tên hoạt động</label>
                  <Input
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Nhập tên cho hoạt động..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSaveActivity}
                    disabled={createActivityMutation.isPending || !activityName.trim()}
                    className="flex-1"
                  >
                    {createActivityMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* File Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileAudio className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{fileName || "Tệp không xác định"}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {timeRange || "Toàn bộ thời lượng"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  {actions.length} Hành động
                </Badge>
                <p className="text-sm text-gray-600">
                  Thời lượng: {totalDuration.toFixed(1)}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action: ActionActivites, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {action.start_time.toFixed(1)}s
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">{action.action_id}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Loại: <span className="font-mono">{action.action_type}</span></p>
                    <p>Thời lượng: {action.duration.toFixed(1)}s</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">Dance Plan Summary</h3>
                  <p className="text-gray-600">Ready to save as activity</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-2xl font-bold text-blue-600">{actions.length}</p>
                <p className="text-sm text-gray-600">Total Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
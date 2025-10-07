"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { DancePlanReposnse } from "@/types/music"
import { ActionActivites } from "@/types/action"
import { createActivity } from "@/features/activities/api/activities-api"
import { Activity } from "@/types/activities"
import { getUserInfoFromToken } from "@/utils/tokenUtils"

// Components
import { Color } from "@/types/color"
import { LoadingState } from "@/components/teacher/previewactivities/loading-state"
import { BackgroundDecorations } from "@/components/teacher/previewactivities/background-decorations"
import { PreviewHeader } from "@/components/teacher/previewactivities/preview-header"
import { FileInfoCard } from "@/components/teacher/previewactivities/file-info-card"
import { ActionsHeader } from "@/components/teacher/previewactivities/actions-header"
import { ActionCard } from "@/components/teacher/previewactivities/action-card"
import { SummaryCard } from "@/components/teacher/previewactivities/summary-card"
import { SaveActivityModal } from "@/components/teacher/previewactivities/save-activity-modal"
import { EmptyState } from "@/components/teacher/previewactivities/empty-state"

// Helper function để extract error message từ API response
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const httpError = error as { response: { status: number; statusText?: string; data?: unknown } }
    const status = httpError.response.status
    const responseData = httpError.response.data
    
    // Lấy message chi tiết từ API response nếu có
    if (responseData && typeof responseData === 'object') {
      const errorData = responseData as { message?: string; error?: string; errors?: string[] }
      if (errorData.message) {
        return errorData.message
      } else if (errorData.error) {
        return errorData.error
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        // Nếu có nhiều errors, join chúng lại
        return errorData.errors.join(', ')
      }
    }
    
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
        return `Lỗi ${status}: ${httpError.response.statusText || 'Không xác định'}`
    }
  } else if (error && typeof error === 'object' && 'request' in error) {
    // Network error
    return 'Không thể kết nối đến server. Vui lòng kiểm tra mạng!'
  } else {
    // Other errors
    const genericError = error as { message?: string }
    return genericError.message || 'Có lỗi không xác định xảy ra!'
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
        statusText: "ACTIVE",
        robotModelId: "6e4e14b3-b073-4491-ab2a-2bf315b3259f"
      }

      await createActivity(activityData)
      toast.success(`Activity "${activityName}" đã được lưu thành công!`)
      setIsModalOpen(false)
      setActivityName("")
      
      // Có thể chuyển hướng về trang activities list
      // router.push('/teacher/activities')
      
    } catch (error: unknown) {
      console.error('Error saving activity:', error)
      
      // Log chi tiết để debug
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: { status: number; statusText?: string; data?: unknown; headers?: unknown } }
        console.error('API Error Details:', {
          status: httpError.response.status,
          statusText: httpError.response.statusText,
          data: httpError.response.data,
          headers: httpError.response.headers
        })
      }
      
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-10">
      <BackgroundDecorations />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <PreviewHeader />
        
        <FileInfoCard fileName={fileName} timeRange={timeRange} />

        {dancePlan?.activity?.actions && Array.isArray(dancePlan.activity.actions) ? (
          <div className="space-y-6">
            <ActionsHeader 
              actionsCount={dancePlan.activity.actions.length}
              onSaveActivity={() => setIsModalOpen(true)}
            />

            <div className="grid gap-6">
              {dancePlan.activity.actions.map((action: ActionActivites, index: number) => (
                <ActionCard key={index} action={action} index={index} />
              ))}
            </div>

            <SummaryCard 
              totalActions={dancePlan.activity.actions.length}
              totalDuration={Math.max(...dancePlan.activity.actions.map(a => a.start_time + a.duration))}
            />
          </div>
        ) : (
          <EmptyState dancePlan={dancePlan} />
        )}

        <SaveActivityModal 
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          activityName={activityName}
          onActivityNameChange={setActivityName}
          onSave={handleSaveActivity}
          isSaving={isSaving}
          fileName={fileName}
          timeRange={timeRange}
        />
      </div>
    </div>
  )
}
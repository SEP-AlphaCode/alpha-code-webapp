"use client"

import UpLoadingState from "@/components/uploading-state"

interface LoadingOverlayProps {
  isGeneratingPlan: boolean
}

export default function LoadingOverlay({ isGeneratingPlan }: LoadingOverlayProps) {
  if (!isGeneratingPlan) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
        <UpLoadingState message="Đang tạo vũ đạo AI. Vui lòng chờ..." />
      </div>
    </div>
  )
}
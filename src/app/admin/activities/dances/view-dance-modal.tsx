"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Dance } from "@/types/dance"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Hash, Settings } from "lucide-react"


interface ViewDanceModalProps {
  isOpen: boolean
  onClose: () => void
  dance: Dance | null
}

export function ViewDanceModal({ 
  isOpen, 
  onClose, 
  dance
}: ViewDanceModalProps) {
  if (!dance) return null

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Kích hoạt
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Không kích hoạt
        </Badge>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="h-5 w-5" />
            Xem chi tiết điệu nhảy
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về điệu nhảy này
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin cơ bản</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border break-all">
                    {dance.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Mã điệu nhảy</label>
                  <p className="text-sm text-blue-900 font-mono bg-blue-50 p-2 rounded border">
                    {dance.code}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Tên điệu nhảy</label>
                  <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded border">
                    {dance.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Mô tả</label>
                  <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded border min-h-[40px]">
                    {dance.description || 'Không có mô tả'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Icon</label>
                  <p className="text-sm text-gray-900 bg-red-50 p-2 rounded border">
                    {dance.icon || 'Không có icon'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Cấu hình</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Thời lượng</label>
                  <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border font-medium">
                    {dance.duration} giây
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">
                    {getStatusBadge(dance.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thời gian</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border font-mono">
                    {formatDate(dance.createdDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
                  <p className="text-sm text-gray-900 bg-orange-50 p-2 rounded border font-mono">
                    {formatDate(dance.lastUpdate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

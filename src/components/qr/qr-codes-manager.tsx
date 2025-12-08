"use client"

import React, { useMemo, useState } from "react"
import { QrCode, Plus, Search, Trash2, Download, Filter, Grid, List, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useQRCode } from "@/features/activities/hooks/use-qr-code"
import { useActivities } from "@/features/activities/hooks/use-activities"
import { QRCode as QRCodeType, QRCodeRequest } from "@/types/qrcode"
import Image from "next/image"
import LoadingState from "@/components/loading-state"
import ErrorState from "@/components/error-state"
import { getUserInfoFromToken } from "@/utils/tokenUtils"
import { toast } from 'sonner'
import { useRobotStore } from "@/hooks/use-robot-store"
import { Activity } from "@/types/activities"

function CreateQRCodeModal({ isOpen, onClose, onSubmit, isLoading, accountId }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: QRCodeRequest) => void
  isLoading: boolean
  accountId?: string
}) {
  const [formData, setFormData] = useState<QRCodeRequest>({
    name: "",
    qrCode: "",
    status: 1,
    activityId: "",
    accountId: accountId ?? "",
    color: "yellow",
  })

  // If accountId prop changes (modal opened with logged-in user), sync into formData
  React.useEffect(() => {
    if (accountId) setFormData((p) => ({ ...p, accountId }))
  }, [accountId])

  const { selectedRobot } = useRobotStore();

  const robotModelId = selectedRobot?.robotModelId || "";

  // load activities for selection when accountId is available
  const accountForQuery = formData.accountId || accountId || ''
  // useActivities signature: (page, size, accountId, search?, robotModelId?)
  // Call hook unconditionally (enabled flag inside hook prevents network call when no accountId)
  const activitiesQuery = useActivities(1, 1000, accountForQuery, '', robotModelId)
  const activities = activitiesQuery?.data?.data || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.qrCode || !formData.activityId || !formData.color) {
      toast.error('Vui lòng điền tất cả các trường bắt buộc (tên, nội dung, hoạt động, màu).')
      return
    }
    if (!formData.accountId) {
      // accountId is required by backend; guide user to login
      toast.error('Bạn cần đăng nhập để tạo thẻ QR — mã tài khoản được lấy tự động từ phiên đăng nhập.')
      return
    }
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({ name: "", qrCode: "", status: 1, activityId: "", accountId: "", color: "yellow" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo thẻ QR mới</DialogTitle>
          <DialogDescription>
            Thêm thẻ QR vào hệ thống. Vui lòng điền đầy đủ các trường bắt buộc.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên thẻ QR *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên thẻ QR"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qrCode">Mã Code QR *</Label>
            <Input
              id="qrCode"
              value={formData.qrCode}
              onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
              placeholder="Nhập nội dung/URL QR"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activityId">Hoạt động *</Label>
            <Select value={formData.activityId} onValueChange={(v: string) => setFormData({ ...formData, activityId: v })}>
              <SelectTrigger>
                <SelectValue placeholder={activities.length ? 'Chọn hoạt động' : 'Không có hoạt động'} />
              </SelectTrigger>
              <SelectContent>
                {activities.length ? (
                  activities.map((a: Activity, idx: number) => (
                    <SelectItem key={`${a.id ?? 'act'}-${idx}`} value={a.id ?? `__${idx}`}>{a.name || a.id || `#${idx + 1}`}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="__none" disabled>Không có hoạt động</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* accountId is taken from token when available — no visible input shown */}
          <div className="space-y-2">
            <Label htmlFor="color">Màu thẻ</Label>
            <Select value={formData.color} onValueChange={(value: string) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn màu thẻ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">🔴 Đỏ</SelectItem>
                <SelectItem value="blue">🔵 Xanh dương</SelectItem>
                <SelectItem value="green">🟢 Xanh lá</SelectItem>
                <SelectItem value="yellow">🟡 Vàng</SelectItem>
                <SelectItem value="purple">🟣 Tím</SelectItem>
                <SelectItem value="pink">🩷 Hồng</SelectItem>
                <SelectItem value="orange">🟠 Cam</SelectItem>
                <SelectItem value="teal">🟢 Teal</SelectItem>
                <SelectItem value="cyan">🔵 Cyan</SelectItem>
                <SelectItem value="gray">⚫ Xám</SelectItem>
                <SelectItem value="black">⚫ Đen</SelectItem>
                <SelectItem value="white">⚪ Trắng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={String(formData.status)} onValueChange={(v: string) => setFormData({ ...formData, status: parseInt(v) })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Đang bật</SelectItem>
                <SelectItem value="2">Tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Đang tạo..." : "Tạo thẻ QR"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDialog({ open, title, description, onClose, onConfirm, loading }: {
  open: boolean
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={!!loading}>{loading ? "Đang xóa..." : "Xác nhận xóa"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function QRCodesManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)

  const qrCodeHooks = useQRCode()
  // get accountId from access token stored in sessionStorage (if available)
  const getCurrentUserAccountId = (): string => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken')
      if (accessToken) {
        try {
          // use imported helper (avoid SSR issues by reading sessionStorage only on client)
          const userInfo = getUserInfoFromToken(accessToken)
          return (userInfo?.id) || ''
        } catch (e) {
          return ''
        }
      }
    }
    return ''
  }

  const accountId = getCurrentUserAccountId()

  // backend expects enum numbers: 1 = enabled, 2 = disabled
  const statusNumber = statusFilter === 'enabled' ? 1 : statusFilter === 'disabled' ? 2 : undefined

  const qrCodesQuery = qrCodeHooks.useGetAllQRCodes(page, pageSize, statusNumber, accountId)
  const { data: qrCodesResponse, isLoading, error, refetch, isFetching } = qrCodesQuery
  const createQRCodeMutation = qrCodeHooks.useCreateQRCode()
  const deleteQRCodeMutation = qrCodeHooks.useDeleteQRCode()
  const updateStatusMutation = qrCodeHooks.useUpdateQRCodeStatus()

  const qrCodes = qrCodesResponse?.data || []

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="default" className="bg-green-100 text-green-800">Đang bật</Badge>
      case 2:
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Đã tắt</Badge>
      default:
        return <Badge variant="secondary">Không rõ</Badge>
    }
  }

  const getStatusText = (status: number) => (status === 1 ? "enabled" : "disabled")

  const getColorClass = (color: string) => {
    switch (color?.toLowerCase()) {
      case "red": return "bg-red-500 border-red-600"
      case "blue": return "bg-blue-500 border-blue-600"
      case "green": return "bg-green-500 border-green-600"
      case "yellow": return "bg-yellow-400 border-yellow-500"
      case "purple": return "bg-purple-500 border-purple-600"
      case "pink": return "bg-pink-500 border-pink-600"
      case "orange": return "bg-orange-500 border-orange-600"
      case "teal": return "bg-teal-500 border-teal-600"
      case "cyan": return "bg-cyan-500 border-cyan-600"
      case "gray":
      case "grey": return "bg-gray-500 border-gray-600"
      case "black": return "bg-gray-800 border-gray-900"
      case "white": return "bg-white border-gray-300"
      default: return "bg-white border-black"
    }
  }

  const filteredQRCodes = useMemo(() => {
    const list = qrCodes as QRCodeType[]
    return list.filter(q => {
      const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase())
        || q.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
        || q.activityId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || getStatusText(q.status) === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [qrCodes, searchTerm, statusFilter])

  const handleCreateQRCode = async (data: QRCodeRequest) => {
    await createQRCodeMutation.mutateAsync(data)
    setIsCreateModalOpen(false)
    refetch()
  }

  const handleDeleteQRCode = async () => {
    if (!confirmDelete) return
    await deleteQRCodeMutation.mutateAsync(confirmDelete.id)
    setConfirmDelete(null)
    refetch()
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    // map UI values to backend enum: enabled -> 1, disabled -> 2
    const mappedStatus = newStatus === 'enabled' ? 1 : 2
    await updateStatusMutation.mutateAsync({ id, status: mappedStatus })
    refetch()
  }

  const handleDownloadQR = (qrCode: QRCodeType) => {
    if (!qrCode.imageUrl) return
    const link = document.createElement("a")
    link.href = qrCode.imageUrl
    link.download = `qr-card-${qrCode.name}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState error={error} onRetry={() => refetch()} className={isFetching ? "opacity-70 pointer-events-none" : ""} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <QrCode className="h-8 w-8 text-blue-600" />
            Quản lý thẻ QR
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và theo dõi các thẻ QR cho hoạt động và tài liệu học tập
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2 stroke-white stroke-3" />
          Tạo thẻ QR
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số thẻ</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Số thẻ QR trong hệ thống</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang bật</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes?.filter((q: QRCodeType) => q.status === 1).length || 0}</div>
            <p className="text-xs text-muted-foreground">Sẵn sàng sử dụng</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã tắt</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes?.filter((q: QRCodeType) => q.status === 2).length || 0}</div>
            <p className="text-xs text-muted-foreground">Không hoạt động</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc & Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm theo tên, nội dung, hoặc hoạt động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="enabled">Đang bật</SelectItem>
                  <SelectItem value="disabled">Đã tắt</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none"><Grid className="h-4 w-4" /></Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none"><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination controls (server-side paging) */}
      {qrCodesResponse && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {Math.max(0, (qrCodesResponse.page - 1) * qrCodesResponse.per_page + 1)} - {Math.min(qrCodesResponse.page * qrCodesResponse.per_page, qrCodesResponse.total_count)} trên {qrCodesResponse.total_count}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!qrCodesResponse.has_previous}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm">Trang {qrCodesResponse.page} / {qrCodesResponse.total_pages}</span>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(qrCodesResponse.total_pages, p + 1))} disabled={!qrCodesResponse.has_next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select value={String(pageSize)} onValueChange={(v: string) => { setPageSize(parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* QR Codes Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Thẻ QR ({filteredQRCodes.length} {filteredQRCodes.length === 1 ? "thẻ" : "thẻ"})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQRCodes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-8 max-w-xs mx-auto">
                <div className="bg-white border-4 border-gray-300 border-dashed rounded-lg p-8 aspect-[3/4] flex flex-col items-center justify-center">
                  <div className="text-center w-full mb-2 mt-6">
                    <h3 className="text-xl font-bold text-gray-400 mb-1 leading-tight">Tên thẻ QR</h3>
                    <p className="text-lg font-medium text-gray-400 leading-tight">Tên hoạt động</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center w-full">
                    <QrCode className="h-24 w-24 text-gray-300" />
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Chưa có thẻ QR</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== "all" ? "Hãy điều chỉnh tìm kiếm hoặc bộ lọc để thấy kết quả." : "Bắt đầu bằng cách tạo thẻ QR đầu tiên cho hoạt động học tập."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo thẻ QR đầu tiên
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQRCodes.map((qrCode, _idx) => {
                const isHovered = hoveredCardId === qrCode.id
                const key = `${qrCode.id ?? 'qr'}-${_idx}`
                return (
                  <div key={key} className={`relative group transition-all duration-300 ${isHovered ? "scale-105" : ""} pb-3 md:pb-9 overflow-visible`} onMouseEnter={() => setHoveredCardId(qrCode.id)} onMouseLeave={() => setHoveredCardId(null)}>
                    <div className={`relative border-4 rounded-2xl p-8 aspect-[3/4] flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 overflow-visible ${getColorClass(qrCode.color)}`}>
                      <div className="absolute top-4 right-4">{getStatusBadge(qrCode.status)}</div>
                      <div className="text-center w-full mb-2 mt-6">
                        <h3 className={`text-xl font-bold mb-1 leading-tight ${qrCode.color?.toLowerCase() === "white" || qrCode.color?.toLowerCase() === "yellow" ? "text-black" : "text-white"}`}>{qrCode.name}</h3>
                        <p className={`text-lg font-medium leading-tight opacity-80 ${qrCode.color?.toLowerCase() === "white" || qrCode.color?.toLowerCase() === "yellow" ? "text-black" : "text-white"}`}>{qrCode.activityName || qrCode.activityId}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center w-full">
                        {qrCode.imageUrl ? (
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <div className="bg-white p-2 rounded-lg">
                              <Image src={qrCode.imageUrl} alt={`QR Code for ${qrCode.name}`} width={120} height={120} className="max-w-[120px] max-h-[120px] object-contain" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-[140px] h-[140px] bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <QrCode className="h-20 w-20 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex items-center justify-between text-xs opacity-75">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: qrCode.color?.toLowerCase() || "#6b7280" }} />
                            <span className={`capitalize ${qrCode.color?.toLowerCase() === "white" || qrCode.color?.toLowerCase() === "yellow" ? "text-black" : "text-white"}`}>{qrCode.color || "N/A"}</span>
                          </div>
                          <div className={`${qrCode.color?.toLowerCase() === "white" || qrCode.color?.toLowerCase() === "yellow" ? "text-black" : "text-white"}`}>
                            <p className="truncate max-w-24 font-mono">{qrCode.qrCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-2 md:mt-0 flex space-x-2 transition-all duration-300 z-20 
                      md:absolute md:inset-x-4 md:-bottom-1 
                      ${isHovered ? "opacity-100 translate-y-0" : "opacity-100 md:opacity-0 md:translate-y-2"}`}>
                      {qrCode.imageUrl && (
                        <Button size="sm" variant="secondary" className="flex-1 bg-white hover:bg-gray-50 text-gray-700 shadow-lg" onClick={() => handleDownloadQR(qrCode)} title="Tải ảnh QR">
                          <Download className="h-4 w-4 mr-1" />Tải ảnh
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" className="flex-1 bg-white hover:bg-gray-50 text-gray-700 shadow-lg" onClick={() => handleStatusChange(qrCode.id, qrCode.status === 1 ? "disabled" : "enabled")}>{qrCode.status === 1 ? (<><EyeOff className="h-4 w-4 mr-1" />Tắt</>) : (<><Eye className="h-4 w-4 mr-1" />Bật</>)}</Button>
                      <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600 text-white shadow-lg" onClick={() => setConfirmDelete({ id: qrCode.id, name: qrCode.name })} disabled={deleteQRCodeMutation.isPending} title="Xóa thẻ QR">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQRCodes.map((qrCode, _idx) => (
                <Card key={`${qrCode.id ?? 'qr'}-${_idx}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 border border-gray-300 rounded-lg p-2 flex items-center justify-center flex-shrink-0 ${getColorClass(qrCode.color)}`}>
                        {qrCode.imageUrl ? (
                          <div className="bg-white rounded-sm p-1">
                            <Image src={qrCode.imageUrl} alt={`QR Code for ${qrCode.name}`} width={48} height={48} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <QrCode className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{qrCode.name}</h3>
                          {getStatusBadge(qrCode.status)}
                        </div>
                        <p className="text-sm text-gray-600 font-mono truncate" title={qrCode.qrCode}>{qrCode.qrCode}</p>
                        <p className="text-xs text-gray-500 truncate">Hoạt động: {qrCode.activityId}</p>
                        <p className="text-xs text-gray-500">Tạo ngày: {new Date(qrCode.createdDate).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {qrCode.imageUrl && (
                          <Button variant="outline" size="sm" onClick={() => handleDownloadQR(qrCode)} title="Tải ảnh QR"><Download className="h-4 w-4" /></Button>
                        )}
                        <Select value={getStatusText(qrCode.status)} onValueChange={(value: string) => handleStatusChange(qrCode.id, value)}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Bật</SelectItem>
                            <SelectItem value="disabled">Tắt</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDelete({ id: qrCode.id, name: qrCode.name })} disabled={deleteQRCodeMutation.isPending} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Xóa thẻ QR"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <CreateQRCodeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateQRCode} isLoading={createQRCodeMutation.isPending} accountId={accountId} />

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Xóa thẻ QR"
        description={`Bạn có chắc chắn muốn xóa thẻ QR "${confirmDelete?.name ?? ""}"? Hành động không thể hoàn tác.`}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteQRCode}
        loading={deleteQRCodeMutation.isPending}
      />
    </div>
  )
}

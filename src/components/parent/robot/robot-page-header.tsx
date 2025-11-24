"use client"

import { useState, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Trash2, PlusCircle } from "lucide-react"
import { useRobotStore } from "@/hooks/use-robot-store"
import { deleteRobot } from "@/features/robots/api/robot-api"
// license key is read from sessionStorage (key)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { webURL } from "@/app/constants/constants"

interface RobotPageHeaderProps {
  title: string
  subtitle: string
  onModelSelect?: (modelName: string) => void
  onAddRobot?: () => void
}

export function RobotPageHeader({ title, subtitle, onModelSelect, onAddRobot }: RobotPageHeaderProps) {
  const { connectMode, setConnectMode, robots, selectedRobot, removeRobot } = useRobotStore()
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [checkingLicense, setCheckingLicense] = useState(false)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      try {
        setCheckingLicense(true);

        const sessionKey =
          typeof window !== "undefined"
            ? sessionStorage.getItem("key") || null
            : null;

        if (sessionKey) {
          setConnectMode("multi");
        } else {
          // Open a modal prompting purchase instead of rendering complex JSX inside toast
          setBuyModalOpen(true)
          setConnectMode("single");
        }
      } catch (err) {
        console.error("License key check failed", err);
        toast.error("Không thể kiểm tra license. Vui lòng thử lại sau.");
        setConnectMode("single");
      } finally {
        setCheckingLicense(false);
      }
    } else {
      setConnectMode("single");
    }
  };


  const modelOptions = useMemo(() => {
    const models = robots.map((r) => ({ id: r.robotModelId, name: r.robotModelName }))
    return Array.from(new Map(models.map((m) => [m.name, m])).values())
  }, [robots])

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    onModelSelect?.(value)
  }

  const handleConfirmDelete = async () => {
    if (!selectedRobot) return
    setIsDeleting(true)

    try {
      await deleteRobot(selectedRobot.id)
      removeRobot(selectedRobot.id)

      // ⚡ Refetch lại list robot
      await queryClient.invalidateQueries({ queryKey: ["robots"] })

      toast.success(`Đã xóa robot "${selectedRobot.name}" thành công!`)
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response === "object" &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Lỗi không xác định")
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Xóa robot thất bại!")
      }
    } finally {
      setIsDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 mb-6 py-3 px-4 sm:py-4 sm:px-6 rounded-xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight">{title}</h1>
          <span className="text-sm sm:text-base text-gray-500 font-medium">{subtitle}</span>
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 sm:gap-4 justify-end">
          {/* 🧩 Model dropdown */}
          {connectMode === "multi" && (
            <div className="w-full sm:w-auto">
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model.name ?? "unknown"} value={model.name ?? ""}>
                      {model.name ?? "Unknown Model"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ➕ Add Robot */}
          <Button onClick={onAddRobot} variant="outline" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm mới Robot</span>
            <span className="sm:hidden">Thêm</span>
          </Button>

          {/* 🗑 Delete Selected Robot */}
          <Button
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={!selectedRobot}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isDeleting ? "Đang xóa..." : "Xóa Robot"}</span>
            <span className="sm:hidden">{isDeleting ? "Đang..." : "Xóa"}</span>
          </Button>

          {/* 🔀 Toggle Single / Multi Mode */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="connect-mode" className="text-sm font-medium text-gray-700 select-none hidden sm:block">
              {connectMode === "single" ? "Single Mode" : "Multi Mode"}
            </Label>
            <Switch
              id="connect-mode"
              checked={connectMode === "multi"}
              onCheckedChange={handleToggle}
              disabled={checkingLicense}
              aria-busy={checkingLicense}
            />
          </div>
        </div>
      </header>

      {/* Buy license modal (opened when user tries to enable Multi Mode without a key) */}
      <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Yêu cầu license</DialogTitle>
          </DialogHeader>

          <div className="text-gray-700 mb-4">
            Vui lòng mua license key để bật <span className="font-semibold text-blue-600">Multi Mode</span>.
          </div>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setBuyModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                window.open(`${webURL}/license-key`);
                setBuyModalOpen(false);
              }}
            >
              Mua ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ⚠️ Confirm Delete Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa robot</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa robot{" "}
            <span className="font-semibold text-red-600">
              &quot;{selectedRobot?.name}&quot;
            </span>{" "}
            không? Hành động này không thể hoàn tác.
          </p>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

'use client'

import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddon } from "@/features/plan/hooks/use-addon"
import { AddonModal, Addon } from "@/types/addon"
import { useEffect } from "react"
import { toast } from "sonner"

interface CreateAddonModalProps {
  isOpen: boolean
  onClose: () => void
  editAddon?: Addon | null
  mode?: "create" | "edit"
}

export function CreateAddonModal({
  isOpen,
  onClose,
  editAddon = null,
  mode = "create",
}: CreateAddonModalProps) {
  const { useCreateAddon, useUpdateAddon } = useAddon()
  const createAddonMutation = useCreateAddon()
  const updateAddonMutation = useUpdateAddon()

  const isEditMode = mode === "edit" && !!editAddon

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddonModal>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      status: 1,
      type: "feature",
    },
  })

  // 🧩 Cập nhật dữ liệu khi edit
  useEffect(() => {
    if (isEditMode && editAddon) {
      reset({
        name: editAddon.name,
        description: editAddon.description,
        price: editAddon.price,
        status: editAddon.status,
        type: editAddon.type,
      })
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        status: 1,
        type: "feature",
      })
    }
  }, [isEditMode, editAddon, reset])

  const status = watch("status")
  const type = watch("type")

  const onSubmit = async (data: AddonModal) => {
    try {
      if (isEditMode && editAddon) {
        await updateAddonMutation.mutateAsync({ id: editAddon.id, data })
        toast.success("Cập nhật addon thành công!")
      } else {
        await createAddonMutation.mutateAsync(data)
        toast.success("Tạo addon mới thành công!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving addon:", error)
      toast.error(isEditMode ? "Cập nhật thất bại" : "Tạo mới thất bại")
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa Addon" : "Tạo Addon mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin addon hiện tại."
              : "Nhập thông tin để tạo addon mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên Addon *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên addon",
                minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên addon"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Nhập mô tả cho addon"
              rows={3}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ) *</Label>
            <Input
              id="price"
              type="number"
              {...register("price", {
                required: "Vui lòng nhập giá",
                min: { value: 0, message: "Giá không được âm" },
                valueAsNumber: true,
              })}
              placeholder="Nhập giá addon"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Loại Addon *</Label>
            <Select
              value={type}
              onValueChange={(v) => setValue("type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại addon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Tính năng thêm</SelectItem>
                <SelectItem value="service">Dịch vụ mở rộng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={status?.toString()}
              onValueChange={(v) => setValue("status", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>Kích hoạt
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>Không kích hoạt
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Đóng
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

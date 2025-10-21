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
import { useSubscription } from "@/features/plan/hooks/use-subscription"
import { SubscriptionPlan, SubscriptionPlanModal } from "@/types/subscription"
import { useEffect } from "react"
import { toast } from "sonner"

interface CreateSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  editSubscription?: SubscriptionPlan | null
  mode?: "create" | "edit"
}

export function CreateSubscriptionModal({
  isOpen,
  onClose,
  editSubscription = null,
  mode = "create",
}: CreateSubscriptionModalProps) {
  const { useCreateSubscription, useUpdateSubscription } = useSubscription()
  const createSubscriptionMutation = useCreateSubscription()
  const updateSubscriptionMutation = useUpdateSubscription()

  const isEditMode = mode === "edit" && !!editSubscription

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionPlanModal>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      billingCycle: 1,
      status: 1,
    },
  })

  // 🧩 Cập nhật dữ liệu khi vào chế độ edit
  useEffect(() => {
    if (isEditMode && editSubscription) {
      reset({
        name: editSubscription.name,
        description: editSubscription.description,
        price: editSubscription.price,
        billingCycle: editSubscription.billingCycle,
        status: editSubscription.status,
      })
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        billingCycle: 1,
        status: 1,
      })
    }
  }, [isEditMode, editSubscription, reset])

  const status = watch("status")
  const billingCycle = watch("billingCycle")

  const onSubmit = async (data: SubscriptionPlanModal) => {
    try {
      if (isEditMode && editSubscription) {
        await updateSubscriptionMutation.mutateAsync({ id: editSubscription.id, data })
        toast.success("Cập nhật gói đăng ký thành công!")
      } else {
        await createSubscriptionMutation.mutateAsync(data)
        toast.success("Tạo gói đăng ký mới thành công!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving subscription:", error)
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
            {isEditMode ? "Chỉnh sửa gói đăng ký" : "Tạo gói đăng ký mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin gói đăng ký hiện tại."
              : "Nhập thông tin để tạo gói đăng ký mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên gói *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên gói",
                minLength: { value: 2, message: "Tên gói phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên gói đăng ký"
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
              placeholder="Nhập mô tả cho gói đăng ký"
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
              placeholder="Nhập giá gói"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

         {/* Billing Cycle */}
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Chu kỳ thanh toán *</Label>
            <Select
              value={billingCycle.toString()}
              onValueChange={(v) => setValue("billingCycle", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chu kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 tháng</SelectItem>
                <SelectItem value="3">3 tháng</SelectItem>
                <SelectItem value="9">9 tháng</SelectItem>
                <SelectItem value="12">1 năm</SelectItem>
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

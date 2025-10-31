"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import dynamic from "next/dynamic"
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
import { useBundle } from "@/features/bundle/hooks/use-bundle"
import { Bundle, BundleModal } from "@/types/bundle"
import { toast } from "sonner"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

interface CreateBundleModalProps {
  isOpen: boolean
  onClose: () => void
  editBundle?: Bundle | null
  mode?: "create" | "edit"
  onSuccess?: () => void
}

const STATUS_MAP = [
  { value: 1, label: "Đang hoạt động" },
  { value: 0, label: "Không hoạt động" },
]

export function CreateBundleModal({
  isOpen,
  onClose,
  editBundle = null,
  mode = "create",
  onSuccess,
}: CreateBundleModalProps) {
  const { useCreateBundle, useUpdateBundle } = useBundle()
  const createBundleMutation = useCreateBundle()
  const updateBundleMutation = useUpdateBundle()
  const isEditMode = mode === "edit" && !!editBundle

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BundleModal>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      status: 1,
      coverImage: null,
      image: null,
    },
  })

  // 🔄 Reset form khi chuyển giữa edit / create
  useEffect(() => {
    if (isEditMode && editBundle) {
      reset({
        id: editBundle.id,
        name: editBundle.name,
        description: editBundle.description,
        price: editBundle.price,
        discountPrice: editBundle.discountPrice,
        status: editBundle.status,
        coverImage: editBundle.coverImage,
        image: null,
      })
    } else {
      reset({
        id: "",
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        status: 1,
        coverImage: null,
        image: null,
      })
    }
  }, [isEditMode, editBundle, reset])

  const status = watch("status")
  const currentImage = watch("coverImage")

  // 🧾 Submit
  const onSubmit = async (data: BundleModal) => {
    try {
      if (isEditMode && editBundle) {
        await updateBundleMutation.mutateAsync({ id: editBundle.id, data })
        toast.success("Cập nhật bundle thành công!")
      } else {
        await createBundleMutation.mutateAsync(data)
        toast.success("Tạo bundle mới thành công!")
      }

      reset()
      onClose()
      onSuccess?.()
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(errorMessage || "Lỗi khi xóa bundle. Vui lòng thử lại.")
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa Bundle" : "Tạo Bundle mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin gói học hiện tại."
              : "Nhập thông tin để tạo gói học mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tên Bundle */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên Bundle *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên bundle",
                minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên bundle"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            {isOpen && (
              <ReactQuill
                theme="snow"
                value={watch("description") || ""}
                onChange={(val) => setValue("description", val)}
                placeholder="Nhập mô tả bundle..."
                className="bg-white rounded-md"
              />
            )}
          </div>

          {/* Giá */}
          <div className="space-y-2">
            <Label htmlFor="price">Giá gốc (VNĐ) *</Label>
            <Input
              id="price"
              type="number"
              {...register("price", {
                required: "Vui lòng nhập giá",
                min: { value: 0, message: "Giá không được âm" },
                valueAsNumber: true,
              })}
              placeholder="Nhập giá gốc"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Giá giảm */}
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Giá giảm (VNĐ)</Label>
            <Input
              id="discountPrice"
              type="number"
              {...register("discountPrice", {
                min: { value: 0, message: "Không được âm" },
                valueAsNumber: true,
              })}
              placeholder="Nhập giá giảm (nếu có)"
              className={errors.discountPrice ? "border-red-500" : ""}
            />
            {errors.discountPrice && (
              <p className="text-sm text-red-500">
                {errors.discountPrice.message}
              </p>
            )}
          </div>

          {/* Ảnh */}
          <div className="space-y-2">
            <Label htmlFor="image">Ảnh đại diện *</Label>
            {currentImage && (
              <img
                src={currentImage}
                alt="cover"
                className="w-32 h-32 rounded-md object-cover mb-2 border"
              />
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setValue("image", e.target.files?.[0] || null)
              }
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <select
              id="status"
              {...register("status", { valueAsNumber: true })}
              className="w-full border rounded-md p-2"
            >
              {STATUS_MAP.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
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

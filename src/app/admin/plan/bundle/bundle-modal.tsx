"use client"

import { useEffect, useState } from "react"
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
import { useAssignCoursesToBundle } from "@/features/bundle/hooks/use-course-bundle"
import { Bundle, BundleModal } from "@/types/bundle"
import { Course } from "@/types/courses"
import { toast } from "sonner"
import { useCourse } from "@/features/courses/hooks/use-course"
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
  const assignCoursesMutation = useAssignCoursesToBundle()
  const isEditMode = mode === "edit" && !!editBundle

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BundleModal & { courseIds?: string[] }>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      status: 1,
      coverImage: null,
      image: null,
      courseIds: [],
    },
  })

  const selectedCourseIds = watch("courseIds") || []

  // 🔄 Load tất cả course
  const { useGetCourses } = useCourse()
  const coursesQuery = useGetCourses(1, 1000) // giả sử lấy tối đa 1000 course để hiển thị

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
        courseIds: [], // Nếu edit bundle có thể fetch các course hiện tại
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
        courseIds: [],
      })
    }
  }, [isEditMode, editBundle, reset])

  const status = watch("status")
  const currentImage = watch("coverImage")

  // 🧾 Submit
  const onSubmit = async (data: BundleModal & { courseIds?: string[] }) => {
  try {
    let bundleId: string

    if (isEditMode && editBundle) {
      const updated = await updateBundleMutation.mutateAsync({ id: editBundle.id, data })
      bundleId = updated.id
      toast.success("Cập nhật bundle thành công!")
    } else {
      const created = await createBundleMutation.mutateAsync(data)
      bundleId = created.id
      toast.success("Tạo bundle mới thành công!")
    }

    // 🔗 Gắn course vào bundle nếu có
    if (data.courseIds && data.courseIds.length > 0) {
      await assignCoursesMutation.mutateAsync({
        bundleId: bundleId, // chỉ 1 bundleId
        courseIds: data.courseIds,
      })
    }

    reset()
    onClose()
    onSuccess?.()
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Lỗi khi tạo/cập nhật bundle. Vui lòng thử lại."
    toast.error(errorMessage)
  }
}

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Chỉnh sửa Bundle" : "Tạo Bundle mới"}</DialogTitle>
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
              {...register("name", { required: true, minLength: 2 })}
              placeholder="Nhập tên bundle"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
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
              {...register("price", { required: true, min: 0, valueAsNumber: true })}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          {/* Giá giảm */}
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Giá giảm (VNĐ)</Label>
            <Input
              id="discountPrice"
              type="number"
              {...register("discountPrice", { min: 0, valueAsNumber: true })}
            />
          </div>

          {/* Ảnh */}
          <div className="space-y-2">
            <Label htmlFor="image">Ảnh đại diện *</Label>
            {currentImage && (
              <img
                src={currentImage as string}
                alt="cover"
                className="w-32 h-32 rounded-md object-cover mb-2 border"
              />
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setValue("image", e.target.files?.[0] || null)}
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

          {/* Chọn khóa học dạng thẻ */}
          <div className="space-y-2">
            <Label>Khóa học trong Bundle</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1 border rounded-md">
              {coursesQuery.data?.data.map((course: Course) => {
                const isSelected = selectedCourseIds.includes(course.id)
                return (
                  <div
                    key={course.id}
                    className={`cursor-pointer border rounded-md p-2 flex flex-col items-center transition-all ${isSelected ? "border-blue-500 bg-blue-100" : "border-gray-200 hover:border-gray-400"
                      }`}
                    onClick={() => {
                      let newSelected = [...selectedCourseIds]
                      if (isSelected) {
                        newSelected = newSelected.filter((id) => id !== course.id)
                      } else {
                        newSelected.push(course.id)
                      }
                      setValue("courseIds", newSelected)
                    }}
                  >
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="w-16 h-16 object-cover rounded-md mb-1"
                    />
                    <span className="text-sm text-center">{course.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Đóng
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditMode ? "Đang cập nhật..." : "Đang tạo...") : isEditMode ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

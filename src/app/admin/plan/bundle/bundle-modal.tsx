"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { toast } from "sonner"
import type { BundleModal } from "@/types/bundle"
import { useBundle } from "@/features/bundle/hooks/use-bundle"
import { useCourse } from "@/features/courses/hooks"
import { useAssignCoursesToBundle } from "@/features/bundle/hooks/use-course-bundle"

interface BundleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  editBundle?: BundleModal | null
  mode: "create" | "edit"
}

export function BundleModal({
  isOpen,
  onClose,
  onSuccess,
  editBundle,
  mode,
}: BundleModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<BundleModal>()
  const { useCreateBundle, useUpdateBundle } = useBundle()
  const { mutateAsync: createBundle } = useCreateBundle()
  const { mutateAsync: updateBundle } = useUpdateBundle()
  const { data: courses, isLoading: loadingCourses } = useCourse().useGetCourses(1, 100)
  const { mutateAsync: assignCourses } = useAssignCoursesToBundle()

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const imageFile = watch("coverImage") // <-- SỬA: Dùng coverImage

  /* -------------------------------------------------------------------------- */
  /* 🧹 Reset form khi mở modal                                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && editBundle) {
        reset(editBundle)
        setPreviewImage(typeof editBundle.coverImage === "string" ? editBundle.coverImage : null)
      } else {
        reset({
          name: "",
          description: "",
          price: 0,
          discountPrice: undefined,
          coverImage: null, // <-- SỬA: Dùng coverImage
        })
        setPreviewImage(null)
        setSelectedCourses([])
      }
    }
  }, [isOpen, editBundle, mode, reset])

  /* -------------------------------------------------------------------------- */
  /* 🖼️ Preview ảnh                                                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (imageFile && imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0]
      setPreviewImage(URL.createObjectURL(file))
    }
  }, [imageFile])

  const handleCourseSelect = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  /* -------------------------------------------------------------------------- */
  /* 💾 Submit form                                                             */
  /* -------------------------------------------------------------------------- */
  const onSubmit = async (data: BundleModal) => {
    try {
      let savedBundleId: string
      let payloadToSubmit: BundleModal | Partial<BundleModal> = data

      if (mode === "edit" && editBundle?.id) {
        // ⚠️ Xử lý chế độ CHỈNH SỬA: Loại bỏ trường 'coverImage' nếu không có file mới
        const isNewFileSelected = data.coverImage && (data.coverImage instanceof File || (data.coverImage instanceof FileList && data.coverImage.length > 0));

        if (!isNewFileSelected) {
          // Sử dụng spread syntax để loại bỏ trường 'coverImage'
          const { coverImage, ...rest } = data
          payloadToSubmit = rest as Partial<BundleModal>
        }
        
        const updated = await updateBundle({ id: editBundle.id, data: payloadToSubmit as BundleModal })
        savedBundleId = updated.id
        toast.success("Cập nhật bundle thành công ✅")
      } else {
        const created = await createBundle(data)
        savedBundleId = created.id
        toast.success("Tạo bundle thành công 🎉")
      }

      // 🧩 Gắn khóa học nếu có
      if (selectedCourses.length > 0) {
        await assignCourses({
          bundleIds: savedBundleId,
          courseId: selectedCourses,
        })
        toast.success("Đã gắn khóa học vào bundle ✅")
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error("Error saving bundle:", err)
      toast.error("Không thể lưu bundle. Vui lòng thử lại ❌")
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 🧱 Giao diện                                                               */
  /* -------------------------------------------------------------------------- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Chỉnh sửa bundle" : "Tạo bundle mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* === FORM CHÍNH === */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Tên bundle</Label>
                <Input {...register("name", { required: true })} placeholder="Nhập tên bundle" />
              </div>

              <div>
                <Label>Mô tả</Label>
                <Textarea {...register("description")} rows={4} placeholder="Mô tả chi tiết..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Giá (VND)</Label>
                  <Input
                    type="number"
                    {...register("price", { required: true, valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Giá giảm (VND)</Label>
                  <Input
                    type="number"
                    {...register("discountPrice", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* === ẢNH COVER === */}
            <div className="space-y-3">
              <Label>Ảnh bìa</Label>
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={400}
                  height={240}
                  className="rounded-md object-cover w-full h-[200px] border"
                />
              ) : (
                <div className="border rounded-md flex items-center justify-center h-[200px] text-gray-400">
                  Chưa chọn ảnh
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                {...register("coverImage")} // <-- SỬA: Dùng coverImage
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setPreviewImage(URL.createObjectURL(file))
                  setValue("coverImage", e.target.files ?? null) // <-- SỬA: Dùng coverImage
                }}
              />
            </div>
          </div>

          {/* === CHỌN KHÓA HỌC === */}
          <div className="border-t pt-4">
            <Label className="font-semibold text-gray-700 mb-2 block">
              Chọn khóa học để gắn vào bundle
            </Label>
            <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
              {loadingCourses ? (
                <p className="text-sm text-gray-400">Đang tải danh sách khóa học...</p>
              ) : courses?.data?.length ? (
                courses.data.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleCourseSelect(course.id)}
                    />
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-10 h-10 rounded object-cover border"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-800">{course.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-400">Không có khóa học nào khả dụng.</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">{mode === "edit" ? "Cập nhật" : "Tạo mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
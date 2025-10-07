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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSkill } from "@/features/activities/hooks/use-skills"

import { SkillModal, Skill } from "@/types/skills"
import { useEffect } from "react"
import { toast } from "sonner"


interface CreateSkillModalProps { // Đã đổi tên props interface
  isOpen: boolean
  onClose: () => void
  editSkill?: Skill | null // Đã đổi tên prop
  mode?: 'create' | 'edit'
}

const { useCreateSkill } = useSkill();
const { useUpdateSkill } = useSkill();

export function CreateSkillModal({ // Đã đổi tên component
  isOpen,
  onClose,
  editSkill = null, // Đã đổi tên prop
  mode = 'create'
}: CreateSkillModalProps) {
  // Đã loại bỏ i18n, chỉ dùng tiếng Việt
  const createSkillMutation = useCreateSkill() // Đã đổi tên mutation
  const updateSkillMutation = useUpdateSkill() // Đã đổi tên mutation
  const skillsQuery = useSkill() // Lấy danh sách kỹ năng nếu cần

  const isEditMode = mode === 'edit' && editSkill // Đã đổi tên biến

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SkillModal>({ // Đã đổi tên type
    defaultValues: {
      code: "",
      name: "",
      imageUrl: "",
      status: 1,
    }
  })

  // Update form when editSkill changes
  useEffect(() => {
    if (isEditMode && editSkill) {
      reset({
        code: editSkill.code,
        name: editSkill.name,
        imageUrl: editSkill.imageUrl,
        status: editSkill.status,
      })
    } else {
      reset({
        code: "",
        name: "",
        imageUrl: "",
        status: 1,
      })
    }
  }, [editSkill, isEditMode, reset]) // Đã đổi tên dependency

  const status = watch("status")

  const onSubmit = async (data: SkillModal) => { // Đã đổi tên type
    try {
      if (isEditMode && editSkill) {
        await updateSkillMutation.mutateAsync({ id: editSkill.id, data })
        toast.success("Cập nhật **kỹ năng** thành công!") // Đã đổi nội dung toast
      } else {
        await createSkillMutation.mutateAsync(data)
        toast.success("Tạo **kỹ năng** thành công!") // Đã đổi nội dung toast
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving skill:", error) // Đã đổi tên log
      toast.error(isEditMode ? 'Cập nhật thất bại. Vui lòng thử lại.' : 'Tạo mới thất bại. Vui lòng thử lại.')
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
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? 'Chỉnh sửa kỹ năng' : 'Tạo kỹ năng mới'} {/* Đã đổi tên tiêu đề */}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin kỹ năng.' // Đã đổi tên mô tả
              : 'Nhập thông tin để tạo kỹ năng mới.' // Đã đổi tên mô tả
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã kỹ năng * {/* Đã đổi tên label */}
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: 'Vui lòng nhập mã kỹ năng', // Đã đổi nội dung lỗi
                minLength: { value: 2, message: 'Mã kỹ năng phải có ít nhất 2 ký tự' } // Đã đổi nội dung lỗi
              })}
              placeholder="Nhập mã kỹ năng" // Đã đổi placeholder
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên kỹ năng * {/* Đã đổi tên label */}
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: 'Vui lòng nhập tên kỹ năng', // Đã đổi nội dung lỗi
                minLength: { value: 2, message: 'Tên kỹ năng phải có ít nhất 2 ký tự' } // Đã đổi nội dung lỗi
              })}
              placeholder="Nhập tên kỹ năng" // Đã đổi placeholder
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Đường dẫn hình ảnh (URL)
            </Label>
            <Input
              id="imageUrl"
              type="url"
              {...register("imageUrl", {
                pattern: {
                  value: /^https?:\/\/.+/, 
                  message: 'URL không hợp lệ'
                }
              })}
              placeholder="Nhập đường dẫn hình ảnh"
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </Label>
            <Select
              value={status.toString()}
              onValueChange={(value) => setValue("status", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Kích hoạt
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Không kích hoạt
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting
                ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...')
                : (isEditMode ? 'Cập nhật' : 'Tạo mới')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}